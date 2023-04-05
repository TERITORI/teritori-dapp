package main

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/db"
	"github.com/TERITORI/teritori-dapp/go/internal/substreams/sinker"
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
		flags.String("indexer-database", "", "Indexer database DNS")
		flags.String("firehose-endpoint", "", "Firehose endpoint")
		flags.String("substreams-mode", "", "Substreams mode. Supported: production, development")
		flags.String("start-block", "", "Block from which we start to process")
		flags.String("stop-block", "", "Block to which we stop the process")
		flags.String("block-progress", "", "Firehose endpoint")
		flags.String("live-block-progress", "", "Firehose endpoint")

		flags.BoolP("insecure", "k", false, "Skip certificate validation on GRPC connection")
		flags.BoolP("plaintext", "p", false, "Establish GRPC connection in plaintext")
		flags.Int("undo-buffer-size", 0, "Number of blocks to keep buffered to handle fork reorganizations")
		flags.Int("live-block-time-delta", 300, "Consider chain live if block time is within this number of seconds of current time. Default: 300 (5 minutes)")
	}),
)

func sinkRunE(cmd *cobra.Command, args []string) error {
	network := args[0]
	MustLoadEnv(network)

	substreamsDir := "substreams-" + network

	// Load global env
	database := MustGetFlagString("indexer-database")
	apiToken := MustGetFlagString("substreams-api-token")

	endpoint := MustGetFlagString("firehose-endpoint")
	startBlock := MustGetFlagString("start-block")
	stopBlock := MustGetFlagString("stop-block")
	blockProgress := MustGetFlagUint64("block-progress")
	liveBlockProgress := MustGetFlagUint64("live-block-progress")
	substreamsModeEnv := MustGetFlagString("substreams-mode")

	substreamsMode := sink.SubstreamsModeDevelopment
	if substreamsModeEnv == "production" {
		substreamsMode = sink.SubstreamsModeProduction
	}

	blockRange := fmt.Sprintf("%s:%s", startBlock, stopBlock)

	manifestPath := filepath.Join(substreamsDir, "substreams.yaml")
	outputModuleName := "txns_out"

	zlog.Info("sync config",
		zap.String("database", database),
		zap.String("endpoint", endpoint),
		zap.String("substreams_mode", substreamsModeEnv),
		zap.String("manifest_path", manifestPath),
		zap.String("output_module_name", outputModuleName),
		zap.String("block_range", blockRange),
		zap.Uint64("block_progress", blockProgress),
		zap.Uint64("live_block_progress", liveBlockProgress),
	)

	// Auto migrate DB
	indexerDB := db.MustConnectIndexerDB(database)
	db.MustMigrateDB(indexerDB)

	// Begin app logics
	app := shutter.New()

	ctx, cancelApp := context.WithCancel(cmd.Context())
	app.OnTerminating(func(_ error) {
		cancelApp()
	})

	dbLoader, err := db.NewLoader(database, zlog, tracer)
	if err != nil {
		return fmt.Errorf("failed to load DB: %w", err)
	}

	if err := dbLoader.LoadTables(); err != nil {
		var e *db.CursorError
		if errors.As(err, &e) {
			return fmt.Errorf("failed to validate cursors table: ", e.Error())
		}
		return fmt.Errorf("failed to load cursors table: %w", err)
	}

	zlog.Info("reading substreams manifest", zap.String("manifest_path", manifestPath))
	pkg, err := manifest.NewReader(manifestPath).Read()
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
		BlockProgress:      blockProgress,
		LiveBlockProgress:  liveBlockProgress,
		SubstreamsMode:     substreamsMode,
		ClientConfig: client.NewSubstreamsClientConfig(
			endpoint,
			apiToken,
			viper.GetBool("run-insecure"),
			viper.GetBool("run-plaintext"),
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
