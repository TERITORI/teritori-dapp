package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"go.uber.org/zap"
	"golang.org/x/exp/slices"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
)

func main() {
	// handle args
	fs := flag.NewFlagSet("flush-db", flag.ContinueOnError)
	var (
		dbHost = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName = fs.String("database-name", "", "database name for postgreSQL")
		dbUser = fs.String("postgres-user", "", "username for postgreSQL")
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

	NETWORK_IDS := []string{
		"ethereum-goerli",
		"ethereum",
		"teritori",
		"teritori-testnet",
		"mumbai",
		"polygon-mumbai",
	}

	if len(os.Args) < 2 {
		panic("You have to provide network-id. Syntax: flush-db <networkID>")
	}

	networkID := os.Args[1]

	if !slices.Contains(NETWORK_IDS, networkID) {
		panic("NetworkId " + networkID + " is not supported")
	}

	sqlFilePath := "./go/cmd/flush-data/sql/clean.sql"
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

	if err := indexerDB.Exec(cleanStmt).Error; err != nil {
		panic(fmt.Errorf("failed to exec sql: %w", err))
	}

	fmt.Println("data has been cleaned", zap.String("networkID", networkID))
}
