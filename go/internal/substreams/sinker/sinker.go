package sinker

import (
	"context"
	"fmt"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	ethereumHandlers "github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/handlers"

	"github.com/pkg/errors"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/ethereum/pb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/streamingfast/logging"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	pbsubstreamsrpc "github.com/streamingfast/substreams/pb/sf/substreams/rpc/v2"
	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
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
	config *TeritoriConfig

	// Set when create transaction
	lastCursor *sink.Cursor
}

type TeritoriConfig struct {
	Network      *networks.EthereumNetwork
	NetworkStore *networks.NetworkStore
	Loader       *Loader
	IndexerMode  indexerdb.IndexerMode
}

func New(sink *sink.Sinker, config *TeritoriConfig, logger *zap.Logger, tracer logging.Tracer) (*PostgresSinker, error) {
	return &PostgresSinker{
		Shutter: shutter.New(),
		Sinker:  sink,

		logger: logger,
		tracer: tracer,

		config: config,
	}, nil
}

func (s *PostgresSinker) Run(ctx context.Context) error {
	// cursor, mistmatchDetected, err := s.loader.GetCursor(ctx, s.OutputModuleHash())
	cursor, err := s.config.Loader.GetOrCreateCursor(s.OutputModuleHash(), s.config.Network.ID, s.config.IndexerMode)
	if err != nil {
		return fmt.Errorf("unable to retrieve cursor: %w", err)
	}

	// Start TX if everything is ok
	s.config.Loader.MustStartDbTransaction()

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
		Network:       s.config.Network,
		NetworkStore:  s.config.NetworkStore,
		IndexerDB:     s.config.Loader.indexerDB,
		DbTransaction: s.config.Loader.dbTransaction,
		IndexerMode:   s.config.IndexerMode,
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
		if err := s.config.Loader.ApplyChanges(cursor, s.OutputModuleHash(), s.config.Network.ID, s.config.IndexerMode); err != nil {
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
