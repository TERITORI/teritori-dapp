package main

import (
	"flag"
	"fmt"
	"net/url"
	"os"
	"time"

	"github.com/TERITORI/teritori-dapp/go/cmd/gno-indexer/clientql"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	// handle args
	fs := flag.NewFlagSet("teritori-indexer", flag.ContinueOnError)
	var (
		dbHost       = fs.String("db-indexer-host", "", "host postgreSQL database")
		dbPort       = fs.String("db-indexer-port", "", "port for postgreSQL database")
		dbPass       = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName       = fs.String("database-name", "", "database name for postgreSQL")
		dbUser       = fs.String("postgres-user", "", "username for postgreSQL")
		networksFile = fs.String("networks-file", "networks.json", "path to networks config file")
		networkID    = fs.String("gno-network-id", "gno-dev", "network id to index")
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

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
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
	network := netstore.MustGetGnoNetwork(*networkID)
	if network.ChainID == "" {
		panic(errors.New("missing chainId in network config"))
	}
	if network.NameServiceContractAddress == "" {
		panic(errors.New("missing nameServiceContractAddress in network config"))
	}
	if network.TxIndexerURL == nil || *network.TxIndexerURL == "" {
		panic(errors.New("missing txIndexerURL in network config"))
	}

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	err = indexerdb.MigrateDB(db)
	if err != nil {
		panic(errors.Wrap(err, "failed migrate database models"))
	}

	logger.Info("instantiating client", zap.String("indexer_url", *network.TxIndexerURL))

	gqlurl, err := url.JoinPath(*network.TxIndexerURL, "graphql", "query")
	if err != nil {
		panic(errors.Wrap(err, "failed to construct indexer query url"))
	}
	clientql := clientql.New(*network, gqlurl, db, logger)
	schedule := gocron.NewScheduler(time.UTC)

	schedule.Every(10).Seconds().Do(func() {
		logger.Info("indexing")
		err = clientql.SyncPosts()
		if err != nil {
			logger.Error("failed to get posts list", zap.Error(err))
		}
		err = clientql.SyncDAOs()
		if err != nil {
			logger.Error("failed to get daos list", zap.Error(err))
		}
		/*
			TODO:
			err = clientql.SyncNames()
			if err != nil {
				logger.Error("failed to get posts list", zap.Error(err))
			}
		*/
	})

	schedule.StartBlocking()
}
