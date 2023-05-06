package sinker

import (
	"context"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/pkg/errors"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	ethereumHandlers "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/handlers"
	pb "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/streamingfast/bstream"
	"github.com/streamingfast/logging"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	"github.com/streamingfast/substreams/client"
	"github.com/streamingfast/substreams/manifest"
	pbsubstreams "github.com/streamingfast/substreams/pb/sf/substreams/v1"
	"gorm.io/gorm"

	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

const BLOCK_PROGRESS = 5000

type Config struct {
	Network          *networks.EthereumNetwork
	NetworkStore     *networks.NetworkStore
	IndexerDB        *gorm.DB
	BlockRange       string
	Pkg              *pbsubstreams.Package
	OutputModule     *pbsubstreams.Module
	OutputModuleName string
	OutputModuleHash manifest.ModuleHash
	ClientConfig     *client.SubstreamsClientConfig

	BlockProgress     uint64 // Define how many block we need to accumulate before commit the DB transactions
	LiveBlockProgress uint64 // In live more, we update DB every block
	SubstreamsMode    sink.SubstreamsMode

	UndoBufferSize     int
	LiveBlockTimeDelta time.Duration
}

type PostgresSinker struct {
	*shutter.Shutter

	Pkg              *pbsubstreams.Package
	OutputModule     *pbsubstreams.Module
	OutputModuleName string
	OutputModuleHash manifest.ModuleHash
	ClientConfig     *client.SubstreamsClientConfig

	BlockProgress     uint64
	LiveBlockProgress uint64
	SubstreamsMode    sink.SubstreamsMode

	UndoBufferSize  int
	LivenessTracker *sink.LivenessChecker

	sink       *sink.Sinker
	lastCursor *sink.Cursor

	blockRange *bstream.Range

	logger *zap.Logger
	tracer logging.Tracer

	network       *networks.EthereumNetwork
	networkStore  *networks.NetworkStore
	indexerDB     *gorm.DB
	dbTransaction *gorm.DB
}

func New(config *Config, logger *zap.Logger, tracer logging.Tracer) (*PostgresSinker, error) {
	s := &PostgresSinker{
		Shutter: shutter.New(),
		logger:  logger,
		tracer:  tracer,

		Pkg:              config.Pkg,
		OutputModule:     config.OutputModule,
		OutputModuleName: config.OutputModuleName,
		OutputModuleHash: config.OutputModuleHash,
		ClientConfig:     config.ClientConfig,

		BlockProgress:     BLOCK_PROGRESS,
		LiveBlockProgress: 1,
		SubstreamsMode:    config.SubstreamsMode,

		UndoBufferSize:  config.UndoBufferSize,
		LivenessTracker: sink.NewLivenessChecker(config.LiveBlockTimeDelta),

		network:      config.Network,
		networkStore: config.NetworkStore,
		indexerDB:    config.IndexerDB,
	}

	s.OnTerminating(func(err error) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		s.Stop(ctx, err)
	})

	var err error
	s.blockRange, err = resolveBlockRange(config.BlockRange, config.OutputModule)
	if err != nil {
		return nil, fmt.Errorf("resolve block range: %w", err)
	}

	return s, nil
}

func (s *PostgresSinker) Stop(ctx context.Context, err error) {
	if s.lastCursor == nil || err != nil {
		return
	}

	// TODO: Replace WriteCursor => UpdateCursor. => Check the behavior
	// _ = s.WriteCursor(s.lastCursor)
}

func (s *PostgresSinker) Start(ctx context.Context) error {
	cursor, err := s.GetOrCreateCursor()

	if err != nil {
		return fmt.Errorf("unable to retrieve cursor: %w", err)
	}

	var sinkOptions []sink.Option
	if s.UndoBufferSize > 0 {
		sinkOptions = append(sinkOptions, sink.WithBlockDataBuffer(s.UndoBufferSize))
	}

	s.sink, err = sink.New(
		s.SubstreamsMode,
		s.Pkg.Modules,
		s.OutputModule,
		s.OutputModuleHash,
		s.handleBlockScopeData,
		s.ClientConfig,
		[]pbsubstreams.ForkStep{
			pbsubstreams.ForkStep_STEP_NEW,
			pbsubstreams.ForkStep_STEP_UNDO,
			pbsubstreams.ForkStep_STEP_IRREVERSIBLE,
		},
		s.logger,
		s.tracer,
		sinkOptions...,
	)
	if err != nil {
		return fmt.Errorf("unable to create sink: %w", err)
	}

	// If sink is created successfully then start the DB transaction
	s.StartDbTransaction()

	s.sink.OnTerminating(s.Shutdown)
	s.OnTerminating(func(err error) {
		s.logger.Info("terminating sink")
		s.sink.Shutdown(err)
	})

	if err := s.sink.Start(ctx, s.blockRange, cursor); err != nil {
		return fmt.Errorf("sink failed: %w", err)
	}

	return nil
}

func (s *PostgresSinker) handleBlockScopeData(ctx context.Context, cursor *sink.Cursor, data *pbsubstreams.BlockScopedData) error {
	for _, output := range data.Outputs {
		if output.Name != s.OutputModuleName {
			continue
		}

		var ethereumBlock pb.EthereumBlock

		err := proto.Unmarshal(output.GetMapOutput().GetValue(), &ethereumBlock)
		if err != nil {
			return errors.Wrap(err, "failed to unmarshal transactions info")
		}

		handler, err := ethereumHandlers.NewHandler(&ethereumHandlers.HandlerConfig{
			Logger:        s.logger,
			Network:       s.network,
			NetworkStore:  s.networkStore,
			IndexerDB:     s.indexerDB,
			DbTransaction: s.dbTransaction,
		})

		if err != nil {
			return errors.Wrap(err, "failed to init new handler")
		}

		for _, tx := range ethereumBlock.Txs {
			if err := handler.HandleETHTx(tx); err != nil {
				panic(err)
			}
		}
	}

	s.lastCursor = cursor

	if cursor.Block.Num()%s.batchBlockModulo(data) == 0 {
		if err := s.ApplyChanges(hex.EncodeToString(s.OutputModuleHash), cursor); err != nil {
			return fmt.Errorf("failed to flush: %w", err)
		}
	}

	return nil
}

func (s *PostgresSinker) batchBlockModulo(blockData *pbsubstreams.BlockScopedData) uint64 {
	if s.LivenessTracker.IsLive(blockData) {
		return s.LiveBlockProgress
	}
	return s.BlockProgress
}

func (s *PostgresSinker) GetOrCreateCursor() (*sink.Cursor, error) {
	c := indexerdb.Cursors{
		ID: hex.EncodeToString(s.OutputModuleHash),
	}

	if err := s.indexerDB.First(&c).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(err, "failed to retrieve cursor")
		}

		// If cursor does not exist then create a new cursor
		cursorStartBlock := s.OutputModule.InitialBlock
		if s.blockRange.StartBlock() > 0 {
			cursorStartBlock = s.blockRange.StartBlock() - 1
		}

		sinkCursor := sink.NewCursor("", bstream.NewBlockRef("", cursorStartBlock))

		if err := s.WriteCursor(sinkCursor); err != nil {
			return nil, errors.Wrap(err, "failed to init cursor")
		}
		return sinkCursor, nil
	}

	return sink.NewCursor(c.Cursor, bstream.NewBlockRef(c.BlockId, c.BlockNum)), nil
}

func (s *PostgresSinker) WriteCursor(sinkCursor *sink.Cursor) error {
	cursor := indexerdb.Cursors{
		ID:       hex.EncodeToString(s.OutputModuleHash),
		Cursor:   sinkCursor.Cursor,
		BlockNum: sinkCursor.Block.Num(),
		BlockId:  sinkCursor.Block.ID(),
		Network:  s.network.ID,
	}

	if err := s.indexerDB.Create(&cursor).Error; err != nil {
		return errors.Wrap(err, "failed to write cursor")
	}

	return nil
}

func (s *PostgresSinker) UpdateCursor(sinkCursor *sink.Cursor) error {
	cursor := indexerdb.Cursors{
		ID:      hex.EncodeToString(s.OutputModuleHash),
		Network: s.network.ID,
	}

	err := s.dbTransaction.Model(&cursor).Updates(indexerdb.Cursors{
		Cursor:   sinkCursor.Cursor,
		BlockNum: sinkCursor.Block.Num(),
		BlockId:  sinkCursor.Block.ID(),
	}).Error

	if err != nil {
		return errors.Wrap(err, "failed to update cursor")
	}

	return nil
}

func (s *PostgresSinker) ApplyChanges(moduleHash string, sinkCursor *sink.Cursor) (err error) {
	if err := s.UpdateCursor(sinkCursor); err != nil {
		return errors.Wrap(err, "failed to update cursor when apply changes")
	}

	if err := s.dbTransaction.Commit().Error; err != nil {
		s.dbTransaction.Rollback()
		return err
	}

	s.logger.Info(">>> applied changes into DB done !")

	// Start new transaction
	s.StartDbTransaction()

	return nil
}

func (s *PostgresSinker) StartDbTransaction() error {
	s.dbTransaction = s.indexerDB.Begin()
	if s.dbTransaction.Error != nil {
		panic("failed to start DB transaction")
	}
	return nil
}
