package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		teritoriDistributorOwnerMnemonic = fs.String("teritori-distributor-owner-mnemonic", "", "mnemonic of the owner of distributor contract")
		ethereumDistributorOwnerMnemonic = fs.String("ethereum-distributor-owner-mnemonic", "", "mnemonic of the owner of distributor contract")
		networksFile                     = fs.String("networks-file", "networks.json", "path to networks config file")

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

	networkId := os.Args[1]
	if networkId == "" {
		panic(errors.New("network id must be provided. Ex: teritori-testnet,ethereum-goerli"))
	}

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
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

	// get db
	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	var mnemonic string
	switch networkId {
	case "teritori-testnet", "teritori":
		if *teritoriDistributorOwnerMnemonic == "" {
			panic(errors.New("teritori-distributor-owner-mnemonic is mandatory. You have to add TERITORI_DISTRIBUTOR_OWNER_MNEMONIC in .env for local testing (Don't commit this value on repo)"))
		}
		mnemonic = *teritoriDistributorOwnerMnemonic
	case "ethereum-goerli", "ethereum":
		if *ethereumDistributorOwnerMnemonic == "" {
			panic(errors.New("ethereum-distributor-owner-mnemonic is mandatory. You have to add ETHEREUM_DISTRIBUTOR_OWNER_MNEMONIC in .env for local testing (Don't commit this value on repo)"))
		}
		mnemonic = *ethereumDistributorOwnerMnemonic
	default:
		panic("unknown network id:" + networkId)
	}

	service, err := NewLeaderboardService(
		networkId,
		&netstore,
		db,
		mnemonic,
		logger,
	)
	if err != nil {
		panic(errors.Wrap(err, "failed to run service update leaderboard"))
	}

	service.start()
}
