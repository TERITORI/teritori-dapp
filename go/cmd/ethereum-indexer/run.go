package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/db"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/sinker"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
	. "github.com/streamingfast/cli"
	"github.com/streamingfast/derr"
	"github.com/streamingfast/shutter"
	sink "github.com/streamingfast/substreams-sink"
	"github.com/streamingfast/substreams/client"
	"github.com/streamingfast/substreams/manifest"
	"go.uber.org/zap"
)

var (
	SUPPORTED_NETWORKS = map[string]bool{
		"ethereum": true,
	}
)

var SinkRunCmd = Command(sinkRunE,
	"run <network>",
	"Sync the data from given network. Supported: ethereum",
	RangeArgs(1, 1),
	Flags(func(flags *pflag.FlagSet) {
		flags.String("db-indexer-host", "", "host postgreSQL database")
		flags.String("db-indexer-port", "", "port for postgreSQL database")
		flags.String("postgres-password", "", "password for postgreSQL database")
		flags.String("database-name", "", "database name for postgreSQL")
		flags.String("postgres-user", "", "username for postgreSQL")

		flags.String("networks-file", "networks.json", "Path to networks config file")

		flags.Int("undo-buffer-size", 0, "Number of blocks to keep buffered to handle fork reorganizations")
		flags.Int("live-block-time-delta", 300, "Consider chain live if block time is within this number of seconds of current time. Default: 300 (5 minutes)")
	}),
)

func sinkRunE(cmd *cobra.Command, args []string) error {
	MustLoadEnv()

	networkID := args[0]

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

	// Load global env
	apiToken := MustGetFlagString("substreams-api-token")

	dbHost := MustGetFlagString("db-indexer-host")
	dbPort := MustGetFlagString("db-indexer-port")
	dbPass := MustGetFlagString("postgres-password")
	dbName := MustGetFlagString("database-name")
	dbUser := MustGetFlagString("postgres-user")

	substreamsModeEnv := "production"

	substreamsMode := sink.SubstreamsModeDevelopment
	if substreamsModeEnv == "production" {
		substreamsMode = sink.SubstreamsModeProduction
	}

	blockRange := fmt.Sprintf("%s:%s", network.IndexStartBlock, network.IndexStopBlock)

	outputModuleName := "txns_out"

	zlog.Info("sync config",
		zap.String("database", fmt.Sprintf("%s:***@%s:%s", dbUser, dbHost, dbPort)),
		zap.String("endpoint", network.FirehoseEndpoint),
		zap.String("substreams_mode", substreamsModeEnv),
		zap.String("manifest_path", network.SubstreamsManifest),
		zap.String("output_module_name", outputModuleName),
		zap.String("block_range", blockRange),
		zap.Uint64("block_progress", network.IndexBlockProgress),
		zap.Uint64("live_block_progress", network.IndexLiveBlockProgress),
	)

	// Auto migrate DB
	// psql://postgres:postgres@localhost:5432/postgres?sslmode=disable
	dns := fmt.Sprintf("psql://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
	indexerDB := db.MustConnectIndexerDB(dns)
	db.MustMigrateDB(indexerDB)

	// Begin app logics
	app := shutter.New()

	ctx, cancelApp := context.WithCancel(cmd.Context())
	app.OnTerminating(func(_ error) {
		cancelApp()
	})

	dbLoader, err := db.NewLoader(dns, zlog, tracer)
	if err != nil {
		return fmt.Errorf("failed to load DB: %w", err)
	}

	zlog.Info("reading substreams manifest", zap.String("manifest_path", network.SubstreamsManifest))
	pkg, err := manifest.NewReader(network.SubstreamsManifest).Read()
	if err != nil {
		return fmt.Errorf("failed to read manifest: %w", err)
	}

	graph, err := manifest.NewModuleGraph(pkg.Modules.Modules)
	if err != nil {
		return fmt.Errorf("failed to create substreams model graph: %w", err)
	}

	zlog.Info("validating output module", zap.String("output_module", outputModuleName))
	module, err := graph.Module(outputModuleName)
	if err != nil {
		return fmt.Errorf("get output module %q: %w", outputModuleName, err)
	}
	if module.GetKindMap() == nil {
		return fmt.Errorf("output module %q is *not* of type 'Mapper'", outputModuleName)
	}

	if module.Output.Type != "proto:teritori.substreams.txns.v1.Txns" {
		return fmt.Errorf("postgresql sync only supports maps with output type 'proto:teritori.substreams.txns.v1.Txns'")
	}
	hashes := manifest.NewModuleHashes()
	outputModuleHash := hashes.HashModule(pkg.Modules, module, graph)

	resolvedStartBlock, resolvedStopBlock, err := readBlockRange(module, blockRange)
	if err != nil {
		return fmt.Errorf("failed to resolve block range: %w", err)
	}
	zlog.Info("resolved block range",
		zap.Int64("start_block", resolvedStartBlock),
		zap.Uint64("stop_block", resolvedStopBlock),
	)

	liveBlockTimeDelta, err := time.ParseDuration(fmt.Sprintf("%ds", viper.GetInt("run-live-block-time-delta")))
	if err != nil {
		return fmt.Errorf("failed to parsed live-block-time-delta: %w", err)
	}

	config := &sinker.Config{
		DBLoader:           dbLoader,
		BlockRange:         blockRange,
		Pkg:                pkg,
		OutputModule:       module,
		OutputModuleName:   outputModuleName,
		OutputModuleHash:   outputModuleHash,
		UndoBufferSize:     viper.GetInt("run-undo-buffer-size"),
		LiveBlockTimeDelta: liveBlockTimeDelta,
		BlockProgress:      network.IndexBlockProgress,
		LiveBlockProgress:  network.IndexLiveBlockProgress,
		SubstreamsMode:     substreamsMode,
		ClientConfig: client.NewSubstreamsClientConfig(
			network.FirehoseEndpoint,
			apiToken,
			false,
			false,
		),
	}

	postgresSinker, err := sinker.New(
		config,
		zlog,
		tracer,
	)
	if err != nil {
		return fmt.Errorf("failed to setup sinker: %w", err)
	}
	postgresSinker.OnTerminating(app.Shutdown)

	app.OnTerminating(func(err error) {
		zlog.Info("application terminating shutting down sinker")
		postgresSinker.Shutdown(err)
	})

	go func() {
		if err := postgresSinker.Start(ctx); err != nil {
			zlog.Error("sinker failed", zap.Error(err))
			postgresSinker.Shutdown(err)
		}
	}()

	signalHandler := derr.SetupSignalHandler(0 * time.Second)
	zlog.Info("ready, waiting for signal to quit")
	select {
	case <-signalHandler:
		zlog.Info("received termination signal, quitting application")
		go app.Shutdown(nil)
	case <-app.Terminating():
		NoError(app.Err(), "application shutdown unexpectedly, quitting")
	}

	zlog.Info("waiting for app termination")
	select {
	case <-app.Terminated():
	case <-ctx.Done():
	case <-time.After(30 * time.Second):
		zlog.Error("application did not terminated within 30s, forcing exit")
	}

	zlog.Info("app terminated")
	return nil
}
