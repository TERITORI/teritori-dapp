package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/sinker"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/quests"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"github.com/streamingfast/cli"
	"github.com/streamingfast/logging"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	"go.uber.org/zap"
	"golang.org/x/exp/slices"
)

var zlog, tracer = logging.RootLogger("teritori-sink", "github.com/TERITORI/sink/cmd/sink")

func init() {
	logging.InstantiateLoggers(logging.WithDefaultLevel(zap.InfoLevel))
}

func main() {
	cli.Run("sink", "Teritori Sink Blockchain to Postgres",
		SinkCmd,
		cli.ConfigureViper("SINK"),
	)
}

var SinkCmd = cli.Command(sinkE,
	"sink",
	"Sink the data from given network",
	cli.Flags(func(flags *pflag.FlagSet) {
		// Teritori params ==========================================================
		flags.String("db-indexer-host", "", "host postgreSQL database")
		flags.String("db-indexer-port", "", "port for postgreSQL database")
		flags.String("postgres-password", "", "password for postgreSQL database")
		flags.String("database-name", "", "database name for postgreSQL")
		flags.String("postgres-user", "", "username for postgreSQL")

		flags.String("networks-file", "networks.json", "Path to networks config file")
		flags.String("indexer-mode", "", "the mode to run indexer: p2e, data. p2e: index only p2e, data: index all data without p2e")
		flags.String("indexer-network-id", "", "target network to index")

		// Add default sink Flags ====================================================================
		flags.Int(sink.FlagUndoBufferSize, 3, "Number of blocks to keep buffered to handle fork reorganizations")

		ignore := sink.FlagIgnore(sink.FlagUndoBufferSize)
		sink.AddFlagsToSet(flags, ignore)
	}),
)

func sinkE(cmd *cobra.Command, args []string) error {
	MustLoadEnv()

	// Prepare params ===============================================================================================
	networkID := MustGetFlagString("indexer-network-id")

	// load networks
	networksFile := MustGetFlagString("networks-file")

	networksBytes, err := os.ReadFile(networksFile)
	if err != nil {
		panic(errors.Wrap(err, "failed to read networks config file"))
	}
	netstore, err := networks.UnmarshalNetworkStore(networksBytes)
	if err != nil {
		panic(errors.Wrap(err, "failed to unmarshal networks config"))
	}

	// get and validate selected network
	network := netstore.MustGetEthereumNetwork(networkID)

	// Verify indexerMode
	mode := MustGetFlagString("indexer-mode")
	var indexerMode indexerdb.IndexerMode

	switch mode {
	case string(indexerdb.IndexerModeData):
		indexerMode = indexerdb.IndexerModeData
	case string(indexerdb.IndexerModeP2E):
		indexerMode = indexerdb.IndexerModeP2E
	default:
		panic("missing indexer-mode or mode is not valid. Only support: p2e, data")
	}

	if indexerMode == indexerdb.IndexerModeP2E && !slices.Contains(network.Features, networks.RiotP2E) {
		panic("The provided network does not support P2E")
	}

	// Load global env
	// apiToken := MustGetFlagString("substreams-api-token")

	dbHost := MustGetFlagString("db-indexer-host")
	dbPort := MustGetFlagString("db-indexer-port")
	dbPass := MustGetFlagString("postgres-password")
	dbName := MustGetFlagString("database-name")
	dbUser := MustGetFlagString("postgres-user")

	substreamsModeEnv := "production"

	// substreamsMode := sink.SubstreamsModeDevelopment
	// if substreamsModeEnv == "production" {
	// 	substreamsMode = sink.SubstreamsModeProduction
	// }

	blockRange := fmt.Sprintf("%s:%s", network.IndexStartBlock, network.IndexStopBlock)
	outputModuleName := "block_out"

	endpoint := network.FirehoseEndpoint
	manifestPath := network.SubstreamsManifest
	// flushInterval := 1000

	// TODO:
	// moduleMismatchMode, err := db.ParseOnModuleHashMismatch(sflags.MustGetString(cmd, "on-module-hash-mistmatch"))
	// cli.NoError(err, "invalid mistmatch mode")

	zlog.Info("sink config",
		zap.String("database", fmt.Sprintf("%s:***@%s:%s", dbUser, dbHost, dbPort)),
		zap.String("endpoint", network.FirehoseEndpoint),
		zap.String("substreams_mode", substreamsModeEnv),
		zap.String("manifest_path", network.SubstreamsManifest),
		zap.String("output_module_name", outputModuleName),
		zap.String("block_range", blockRange),
	)

	// Auto migrate DB
	// Init db
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		dbHost, dbUser, dbPass, dbName, dbPort)
	indexerDB, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	err = indexerdb.MigrateDB(indexerDB)
	if err != nil {
		panic(errors.Wrap(err, "failed migrate database models"))
	}

	// inject quests
	qs, err := quests.Quests()
	if err != nil {
		panic(errors.Wrap(err, "failed to get embedded quests"))
	}
	for _, q := range qs {
		indexerDB.Save(&indexerdb.Quest{
			ID:        q.ID,
			Title:     q.Title,
			NetworkID: networkID,
		})
	}

	// Begin substreams app logics ========================================================================================
	app := shutter.New()

	ctx, cancelApp := context.WithCancel(cmd.Context())
	app.OnTerminating(func(_ error) {
		cancelApp()
	})

	loader := sinker.NewLoader(indexerDB, zlog)

	config := &sinker.TeritoriConfig{
		Network:      network,
		NetworkStore: &netstore,
		Loader:       loader,
		IndexerMode:  indexerMode,
	}

	sink, err := sink.NewFromViper(
		cmd,
		"teritori.ethereum_block.v1.EthereumBlock",
		endpoint, manifestPath, outputModuleName, blockRange,
		zlog,
		tracer,
	)
	if err != nil {
		return fmt.Errorf("unable to setup sinker: %w", err)
	}

	postgresSinker, err := sinker.New(sink, config, zlog, tracer)
	if err != nil {
		return fmt.Errorf("failed to setup sinker: %w", err)
	}

	postgresSinker.OnTerminating(app.Shutdown)
	app.OnTerminating(func(err error) {
		zlog.Info("application terminating shutting down sinker")
		postgresSinker.Shutdown(err)
	})

	go func() {
		if err := postgresSinker.Run(ctx); err != nil {
			zlog.Error("sinker failed", zap.Error(err))
			postgresSinker.Shutdown(err)
		}
	}()

	zlog.Info("ready, waiting for signal to quit")

	signalHandler, isSignaled, _ := cli.SetupSignalHandler(0*time.Second, zlog)
	select {
	case <-signalHandler:
		go app.Shutdown(nil)
		break
	case <-app.Terminating():
		zlog.Info("run terminating", zap.Bool("from_signal", isSignaled.Load()), zap.Bool("with_error", app.Err() != nil))
		break
	}

	zlog.Info("waiting for run termination")
	select {
	case <-app.Terminated():
	case <-time.After(30 * time.Second):
		zlog.Warn("application did not terminate within 30s")
	}

	if err := app.Err(); err != nil {
		return err
	}

	zlog.Info("run terminated gracefully")
	return nil
}
