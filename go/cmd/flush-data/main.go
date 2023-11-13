package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"golang.org/x/exp/slices"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
)

func main() {
	// handle args
	fs := flag.NewFlagSet("flush-db", flag.ContinueOnError)
	var (
		dbHost          = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort          = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass          = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName          = fs.String("database-name", "", "database name for postgreSQL")
		dbUser          = fs.String("postgres-user", "", "username for postgreSQL")
		networksFile    = fs.String("networks-file", "networks.json", "path to networks config file")
		mode            = fs.String("indexer-mode", "", "mode to run indexer: p2e, data")
		targetNetworkID = fs.String("target-network-id", "", "target network id to flush")
	)
	if err := ff.Parse(fs, os.Args[1:],
		ff.WithEnvVars(),
		ff.WithIgnoreUndefined(true),
		ff.WithConfigFile(".env"),
		ff.WithConfigFileParser(ff.EnvParser),
		ff.WithAllowMissingConfigFile(true),
	); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	// Check target network id
	networkID := *targetNetworkID
	if networkID == "" {
		panic("You must provide the <target-network-id>")
	}

	// load networks
	networksBytes, err := os.ReadFile(*networksFile)
	if err != nil {
		panic(errors.Wrap(err, "failed to read networks config file"))
	}
	netstore, err := networks.UnmarshalNetworkStore(networksBytes)
	if err != nil {
		panic(errors.Wrap(err, "failed to unmarshal networks config"))
	}

	// get and validate selected network
	network := netstore.MustGetNetwork(networkID)

	// Check indexer mode
	var sqlFilePath string
	var indexerMode indexerdb.IndexerMode

	switch *mode {
	case string(indexerdb.IndexerModeData):
		sqlFilePath = "./go/cmd/flush-data/sql/clean-data.sql"
		indexerMode = indexerdb.IndexerModeData
	case string(indexerdb.IndexerModeP2E):
		sqlFilePath = "./go/cmd/flush-data/sql/clean-p2e.sql"
		indexerMode = indexerdb.IndexerModeP2E
	default:
		panic("missing indexer-mode or mode is not valid. Only support: p2e, data")
	}

	if indexerMode == indexerdb.IndexerModeP2E && !slices.Contains(network.GetBase().Features, networks.RiotP2E) {
		panic("The provided network does not support P2E")
	}

	stmtBytes, err := os.ReadFile(sqlFilePath)
	if err != nil {
		panic(fmt.Errorf("failed to load sql file: %w", err))
	}

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	indexerDB, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	cleanStmt := string(stmtBytes)
	cleanStmt = strings.Replace(cleanStmt, "<networkID>", networkID, -1)
	cleanStmt = strings.Replace(cleanStmt, "<indexerMode>", string(indexerMode), -1)

	if err := indexerDB.Exec(cleanStmt).Error; err != nil {
		panic(fmt.Errorf("failed to exec sql: %w", err))
	}

	fmt.Printf("Data has been cleaned - Mode: %s - NetworkID: %s\n", *mode, networkID)
}
