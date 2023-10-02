package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
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
		flags.String("db-indexer-host", "", "host postgreSQL database")
		flags.String("db-indexer-port", "", "port for postgreSQL database")
		flags.String("postgres-password", "", "password for postgreSQL database")
		flags.String("database-name", "", "database name for postgreSQL")
		flags.String("postgres-user", "", "username for postgreSQL")
	}),
)

func sinkCleanE(cmd *cobra.Command, args []string) error {
	zlog.Info("cleaning offchain data...")

	MustLoadEnv()

	dbHost := MustGetFlagString("db-indexer-host")
	dbPort := MustGetFlagString("db-indexer-port")
	dbPass := MustGetFlagString("postgres-password")
	dbName := MustGetFlagString("database-name")
	dbUser := MustGetFlagString("postgres-user")

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		dbHost, dbUser, dbPass, dbName, dbPort)
	indexerDB, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	sqlFilePath := "./go/cmd/ethereum-indexer/sql/clean.sql"
	stmtBytes, err := os.ReadFile(sqlFilePath)
	if err != nil {
		return fmt.Errorf("failed to load sql file: %w", err)
	}

	zlog.Info("executing sql file",
		zap.String("sql_file", sqlFilePath),
	)

	// load networks
	networkID := args[0]
	if networkID != "ethereum" && networkID != "ethereum-goerli" && networkID != "polygon-mumbai" {
		panic("given network is not supported")
	}

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

	cleanStmt := string(stmtBytes)
	cleanStmt = strings.Replace(cleanStmt, "<network>", network.ID, -1)
	cleanStmt = strings.Replace(cleanStmt, "<networkPrefix>", network.IDPrefix, -1)

	if err := indexerDB.Exec(cleanStmt).Error; err != nil {
		return fmt.Errorf("failed to exec sql: %w", err)
	}

	zlog.Info("data has been cleaned", zap.String("networkID", networkID), zap.String("IdPrefix", network.IDPrefix))

	return nil
}
