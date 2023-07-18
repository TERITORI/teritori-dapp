package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/go-co-op/gocron"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

var nameRegexp = regexp.MustCompile(` * \[(.+)\]\(/r/demo/users\:`)

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
		networkID    = fs.String("gno-network-id", "gno-teritori", "network id to index")
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

	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	db, err := indexerdb.NewPostgresDB(dataConnexion)

	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	err = indexerdb.MigrateDB(db)
	if err != nil {
		panic(errors.Wrap(err, "failed migrate database models"))
	}

	schedule := gocron.NewScheduler(time.UTC)
	schedule.Every(2).Minutes().Do(func() {
		logger.Info("indexing")
		resp, err := http.Get(network.GnowebURL + "/r/demo/users")
		if err != nil {
			logger.Error("failed to get names list", zap.Error(err))
			return
		}
		data, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			logger.Error("failed to read response body", zap.Error(err))
			return
		}
		render := string(data)
		matches := nameRegexp.FindAllStringSubmatch(render, -1)
		var names []indexerdb.Name
		for _, m := range matches {
			names = append(names, indexerdb.Name{Value: m[1] + ".gno", NetworkID: network.ChainID})
		}
		if err := db.Save(names).Error; err != nil {
			logger.Error("failed to save names", zap.Error(err))
			return
		}
		logger.Info("done", zap.Int("names-count", len(names)))
	})
	schedule.StartBlocking()
}
