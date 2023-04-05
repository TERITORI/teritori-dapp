package sinker

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/db"
	pb "github.com/TERITORI/teritori-dapp/go/internal/substreams/pb"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/streamingfast/bstream"
	"github.com/streamingfast/logging"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	pbddatabase "github.com/streamingfast/substreams-sink-postgres/pb/substreams/sink/database/v1"
	"github.com/streamingfast/substreams/client"
	"github.com/streamingfast/substreams/manifest"
	pbsubstreams "github.com/streamingfast/substreams/pb/sf/substreams/v1"
	"gorm.io/gorm"

	"go.uber.org/zap"
	"google.golang.org/protobuf/proto"
)

func GetLocalABI(path string) string {
	abiFile, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer abiFile.Close()

	result, err := io.ReadAll(abiFile)
	if err != nil {
		panic(err)
	}
	return string(result)
}

type Config struct {
	IndexerDB        *gorm.DB
	DBLoader         *db.Loader
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

	DBLoader         *db.Loader
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

	stats *Stats

	blockRange *bstream.Range

	logger *zap.Logger
	tracer logging.Tracer

	squadStakingABI *abi.ABI
}

func New(config *Config, logger *zap.Logger, tracer logging.Tracer) (*PostgresSinker, error) {
	SQUAD_STAKING_ABI_PATH := "go/internal/substreams/ethereum/abi/squad_staking.json"
	squadStakingABI := mustLoadABI(SQUAD_STAKING_ABI_PATH)

	s := &PostgresSinker{
		Shutter: shutter.New(),
		stats:   NewStats(logger),
		logger:  logger,
		tracer:  tracer,

		DBLoader:         config.DBLoader,
		Pkg:              config.Pkg,
		OutputModule:     config.OutputModule,
		OutputModuleName: config.OutputModuleName,
		OutputModuleHash: config.OutputModuleHash,
		ClientConfig:     config.ClientConfig,

		BlockProgress:     config.BlockProgress,
		LiveBlockProgress: config.LiveBlockProgress,
		SubstreamsMode:    config.SubstreamsMode,

		UndoBufferSize:  config.UndoBufferSize,
		LivenessTracker: sink.NewLivenessChecker(config.LiveBlockTimeDelta),

		squadStakingABI: &squadStakingABI,
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

func (s *PostgresSinker) Start(ctx context.Context) error {
	cursor, err := s.DBLoader.GetCursor(ctx, hex.EncodeToString(s.OutputModuleHash))
	if err != nil && !errors.Is(err, db.ErrCursorNotFound) {
		return fmt.Errorf("unable to retrieve cursor: %w", err)
	}

	if errors.Is(err, db.ErrCursorNotFound) {
		cursorStartBlock := s.OutputModule.InitialBlock
		if s.blockRange.StartBlock() > 0 {
			cursorStartBlock = s.blockRange.StartBlock() - 1
		}

		cursor = sink.NewCursor("", bstream.NewBlockRef("", cursorStartBlock))

		if err = s.DBLoader.WriteCursor(ctx, hex.EncodeToString(s.OutputModuleHash), cursor); err != nil {
			return fmt.Errorf("failed to create initial cursor: %w", err)
		}
	}

	s.OnTerminating(func(_ error) { s.stats.Close() })
	s.stats.OnTerminated(func(err error) { s.Shutdown(err) })
	s.stats.Start(2 * time.Second)

	return s.Run(ctx)
}

func (s *PostgresSinker) Stop(ctx context.Context, err error) {
	if s.lastCursor == nil || err != nil {
		return
	}

	_ = s.DBLoader.WriteCursor(ctx, hex.EncodeToString(s.OutputModuleHash), s.lastCursor)
}

func (s *PostgresSinker) Run(ctx context.Context) error {
	cursor, err := s.DBLoader.GetCursor(ctx, hex.EncodeToString(s.OutputModuleHash))
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

func (s *PostgresSinker) applyDatabaseChanges(dbChanges *pbddatabase.DatabaseChanges) error {
	for _, change := range dbChanges.TableChanges {
		if !s.DBLoader.HasTable(change.Table) {
			return fmt.Errorf(
				"your Substreams sent us a change for a table named %s we don't know about on %s (available tables: %s)",
				change.Table,
				s.DBLoader.GetIdentifier(),
				s.DBLoader.GetAvailableTablesInSchema(),
			)
		}

		primaryKey := change.Pk
		changes := map[string]string{}
		extras := map[string]string{}

		// Remove all extra from changes
		for _, field := range change.Fields {
			if strings.HasPrefix(field.Name, "__extra") {
				extras[field.Name] = field.NewValue
			} else {
				changes[field.Name] = field.NewValue
			}
		}

		switch change.Operation {
		case pbddatabase.TableChange_CREATE:
			// TWEAK: sometime we are unable to get some value directly from indexer so we have to tweak here to add needed info
			// Handle the case of Buy NFT: activity trade, we do not have the seller_id from indexer so we need to get it from DB
			if extras["__extra_operation"] == "insert_trade" {
				var currentOwnerId string
				row := s.DBLoader.QueryRow("SELECT owner_id FROM nfts WHERE id = $1", extras["__extra_nft_id"])
				if err := row.Scan(&currentOwnerId); err != nil {
					return fmt.Errorf("unable to get current owner_id for nft: %s", extras["__extra_nft_id"])
				}
				changes["seller_id"] = currentOwnerId
			}

			err := s.DBLoader.Insert(change.Table, primaryKey, changes)
			if err != nil {
				return fmt.Errorf("database insert: %w", err)
			}
		case pbddatabase.TableChange_UPDATE:
			err := s.DBLoader.Update(change.Table, primaryKey, changes)
			if err != nil {
				return fmt.Errorf("database update: %w", err)
			}
		case pbddatabase.TableChange_DELETE:
			err := s.DBLoader.Delete(change.Table, primaryKey)
			if err != nil {
				return fmt.Errorf("database delete: %w", err)
			}
		default:
			//case database.TableChange_UNSET:
		}
	}
	return nil
}

func DecodeTransactionInputData(contractABI *abi.ABI, data []byte) {
	// The first 4 bytes of the t represent the ID of the method in the ABI
	// https://docs.soliditylang.org/en/v0.5.3/abi-spec.html#function-selector
	methodSigData := data[:4]
	method, err := contractABI.MethodById(methodSigData)
	if err != nil {
		panic(err)
	}

	inputsSigData := data[4:]
	inputsMap := make(map[string]interface{})
	if err := method.Inputs.UnpackIntoMap(inputsMap, inputsSigData); err != nil {
		panic(err)
	}

	fmt.Printf("Method Name: %s\n", method.Name)
	fmt.Printf("Method inputs: %v\n", inputsMap)
}

func (s *PostgresSinker) handleBlockScopeData(ctx context.Context, cursor *sink.Cursor, data *pbsubstreams.BlockScopedData) error {
	for _, output := range data.Outputs {
		if output.Name != s.OutputModuleName {
			continue
		}

		var txns pb.Txns

		err := proto.Unmarshal(output.GetMapOutput().GetValue(), &txns)
		if err != nil {
			return fmt.Errorf("unmarshal database changes: %w", err)
		}

		for _, txnData := range txns.Data {
			DecodeTransactionInputData(s.squadStakingABI, txnData.Calldata)
		}
	}

	s.lastCursor = cursor

	if cursor.Block.Num()%s.batchBlockModulo(data) == 0 {
		flushStart := time.Now()

		if err := s.DBLoader.Flush(ctx, hex.EncodeToString(s.OutputModuleHash), cursor); err != nil {
			return fmt.Errorf("failed to flush: %w", err)
		}

		flushDuration := time.Since(flushStart)
		FlushCount.Inc()
		FlushedEntriesCount.AddUint64(s.DBLoader.OperationsCount)
		FlushDuration.AddInt(int(flushDuration.Nanoseconds()))
	}

	return nil
}

func (s *PostgresSinker) batchBlockModulo(blockData *pbsubstreams.BlockScopedData) uint64 {
	if s.LivenessTracker.IsLive(blockData) {
		return s.LiveBlockProgress
	}
	return s.BlockProgress
}
