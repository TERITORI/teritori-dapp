package sinker

import (
	"context"
	"fmt"
	"time"

	ethereumHandlers "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/handlers"

	"github.com/pkg/errors"
	"github.com/streamingfast/bstream"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/streamingfast/logging"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	pbsubstreamsrpc "github.com/streamingfast/substreams/pb/sf/substreams/rpc/v2"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
	"gorm.io/gorm"
)

const (
	HISTORICAL_BLOCK_FLUSH_EACH = 1000
	LIVE_BLOCK_FLUSH_EACH       = 1
)

type PostgresSinker struct {
	*shutter.Shutter
	*sink.Sinker

	logger *zap.Logger
	tracer logging.Tracer

	// Teritori config
	network      *networks.EthereumNetwork
	networkStore *networks.NetworkStore
	indexerDB    *gorm.DB

	// Set when create transaction
	dbTransaction *gorm.DB
	lastCursor    *sink.Cursor
}

type Config struct {
	Network      *networks.EthereumNetwork
	NetworkStore *networks.NetworkStore
	IndexerDB    *gorm.DB
}

func New(sink *sink.Sinker, config *Config, logger *zap.Logger, tracer logging.Tracer) (*PostgresSinker, error) {
	return &PostgresSinker{
		Shutter: shutter.New(),
		Sinker:  sink,

		logger: logger,
		tracer: tracer,

		network:      config.Network,
		networkStore: config.NetworkStore,
		indexerDB:    config.IndexerDB,
	}, nil
}

func (s *PostgresSinker) Run(ctx context.Context) error {
	// cursor, mistmatchDetected, err := s.loader.GetCursor(ctx, s.OutputModuleHash())
	cursor, err := s.GetOrCreateCursor()
	if err != nil {
		return fmt.Errorf("unable to retrieve cursor: %w", err)
	}

	// Start TX if everything is ok
	s.MustStartDbTransaction()

	s.Sinker.OnTerminating(s.Shutdown)
	s.OnTerminating(func(err error) {
		s.logger.Info("postgres sinker terminating", zap.String("last_block_written", s.lastCursor.Block().ID()))
		s.Sinker.Shutdown(err)
	})

	s.OnTerminated(func(err error) { s.Shutdown(err) })

	logEach := 15 * time.Second
	if s.logger.Core().Enabled(zap.DebugLevel) {
		logEach = 5 * time.Second
	}

	s.logger.Info("starting postgres sink",
		zap.Duration("stats_refresh_each", logEach),
		zap.Stringer("restarting_at", cursor.Block()),
	)
	s.Sinker.Run(ctx, cursor, s)

	return nil
}

func (s *PostgresSinker) HandleBlockScopedData(ctx context.Context, data *pbsubstreamsrpc.BlockScopedData, isLive *bool, cursor *sink.Cursor) error {
	output := data.Output

	if output.Name != s.OutputModuleName() {
		return fmt.Errorf("received data from wrong output module, expected to received from %q but got module's output for %q", s.OutputModuleName(), output.Name)
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

	s.lastCursor = cursor

	if cursor.Block().Num()%s.batchBlockModulo(data, isLive) == 0 {
		if err := s.ApplyChanges(s.OutputModuleHash(), cursor); err != nil {
			return fmt.Errorf("failed to flush: %w", err)
		}
	}

	return nil
}

func (s *PostgresSinker) HandleBlockUndoSignal(ctx context.Context, data *pbsubstreamsrpc.BlockUndoSignal, cursor *sink.Cursor) error {
	return fmt.Errorf("received undo signal but there is no handling of undo, this is because you used `--undo-buffer-size=0` which is invalid right now")
}

func (s *PostgresSinker) batchBlockModulo(blockData *pbsubstreamsrpc.BlockScopedData, isLive *bool) uint64 {
	if isLive == nil {
		panic(fmt.Errorf("liveness checker has been disabled on the Sinker instance, this is invalid in the context of 'substreams-sink-postgres'"))
	}

	if *isLive {
		return LIVE_BLOCK_FLUSH_EACH
	}

	return HISTORICAL_BLOCK_FLUSH_EACH
}

func (s *PostgresSinker) GetOrCreateCursor() (*sink.Cursor, error) {
	c := indexerdb.Cursors{
		ID: s.OutputModuleHash(),
	}

	err := s.indexerDB.First(&c).Error

	// If no error then return the cursor
	if err == nil {
		cursor := bstream.NewBlockRef(c.BlockId, c.BlockNum).String()
		return sink.NewCursor(cursor)
	}

	// If record not found then insert new cursor
	if errors.Is(err, gorm.ErrRecordNotFound) {
		sinkCursor := sink.NewBlankCursor()

		if err := s.WriteCursor(sinkCursor); err != nil {
			return nil, errors.Wrap(err, "failed to init cursor")
		}
		return sinkCursor, nil
	}

	//TODO: If mismatch then adjust cursor
	// if mistmatchDetected {
	// 	if err := s.loader.InsertCursor(ctx, s.OutputModuleHash(), cursor); err != nil {
	// 		s.Shutdown(fmt.Errorf("unable to write new cursor after module mistmatch: %w", err))
	// 		return
	// 	}
	// }

	// If other error then throw error
	return nil, errors.Wrap(err, "failed to retrieve cursor")
}

func (s *PostgresSinker) WriteCursor(sinkCursor *sink.Cursor) error {
	cursor := indexerdb.Cursors{
		ID:       s.OutputModuleHash(),
		Cursor:   sinkCursor.String(),
		BlockNum: sinkCursor.Block().Num(),
		BlockId:  sinkCursor.Block().ID(),
		Network:  s.network.ID,
	}

	if err := s.indexerDB.Create(&cursor).Error; err != nil {
		return errors.Wrap(err, "failed to write cursor")
	}

	return nil
}

func (s *PostgresSinker) UpdateCursor(sinkCursor *sink.Cursor) error {
	cursor := indexerdb.Cursors{
		ID:      s.OutputModuleHash(),
		Network: s.network.ID,
	}

	err := s.dbTransaction.Model(&cursor).Updates(indexerdb.Cursors{
		Cursor:   sinkCursor.Cursor.String(),
		BlockNum: sinkCursor.Block().Num(),
		BlockId:  sinkCursor.Block().ID(),
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
	s.MustStartDbTransaction()

	return nil
}

func (s *PostgresSinker) MustStartDbTransaction() {
	s.dbTransaction = s.indexerDB.Begin()
	if s.dbTransaction.Error != nil {
		panic("failed to start DB transaction")
	}
}
