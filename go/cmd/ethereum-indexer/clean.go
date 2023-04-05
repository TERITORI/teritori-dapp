package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/substreams/db"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	. "github.com/streamingfast/cli"
	"go.uber.org/zap"
)

var SinkCleanCmd = Command(sinkCleanE,
	"clean <network>",
	"Clean all the data related to given network",
	RangeArgs(1, 1),
	Flags(func(flags *pflag.FlagSet) {
		flags.String("indexer-database", "", "Indexer database DNS")
	}),
)

func sinkCleanE(cmd *cobra.Command, args []string) error {
	zlog.Info("cleaning offchain data...")

	network := args[0]
	MustLoadEnv(network)

	database := MustGetFlagString("indexer-database")
	indexerDB := db.MustConnectIndexerDB(database)

	sqlFilePath := "sql/clean.sql"
	stmtBytes, err := os.ReadFile(sqlFilePath)
	if err != nil {
		return fmt.Errorf("failed to load sql file: %w", err)
	}

	zlog.Info("executing sql file",
		zap.String("sql_file", sqlFilePath),
	)

	networkPrefix := ""
	switch network {
	case "ethereum":
		networkPrefix = "eth"
	default:
		return fmt.Errorf("network not supported: %s", network)
	}

	cleanStmt := string(stmtBytes)
	cleanStmt = strings.Replace(cleanStmt, "<network>", network, -1)
	cleanStmt = strings.Replace(cleanStmt, "<networkPrefix>", networkPrefix, -1)

	if err := indexerDB.Exec(cleanStmt).Error; err != nil {
		return fmt.Errorf("failed to exec sql: %w", err)
	}

	zlog.Info(network + " data has been cleaned")

	return nil
}
