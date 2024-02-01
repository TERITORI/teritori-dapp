package main

import (
	"flag"
	"fmt"
	"os"

	"golang.org/x/exp/slices"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	fs := flag.NewFlagSet("p2e-update-leaderboard", flag.ContinueOnError)
	var (
		networksFile = fs.String("networks-file", "networks.json", "path to networks config file")

		dbHost          = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort          = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass          = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName          = fs.String("database-name", "", "database name for postgreSQL")
		dbUser          = fs.String("postgres-user", "", "username for postgreSQL")
		targetNetworkID = fs.String("target-network-id", "", "target network to index")
		mnemonic        = fs.String("mnemonic", "", "mnemonic of reporter account")
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

	if !slices.Contains(network.GetBase().Features, networks.RiotP2E) {
		panic("The provided network does not support P2E")
	}

	if *mnemonic == "" {
		panic(errors.New("you must provide the <mnemonic>"))
	}

	// get logger
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to init logger"))
	}

	// TODO: check if mnemonic is correct, matched with distributor account =============================

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

	service, err := NewLeaderboardService(
		network.GetBase().ID,
		&netstore,
		db,
		*mnemonic,
		logger,
	)
	if err != nil {
		panic(errors.Wrap(err, "failed to run service update leaderboard"))
	}

	service.startScheduler()
}
