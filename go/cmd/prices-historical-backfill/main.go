package main

import (
	"database/sql"
	"flag"
	"os"
	"time"

	"github.com/TERITORI/teritori-dapp/go/internal/pgutil"
	"github.com/TERITORI/teritori-dapp/go/internal/urlutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/coingeckoprices"
	"github.com/TERITORI/teritori-dapp/go/pkg/prices_db"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
)

func main() {
	fs := flag.NewFlagSet("prices-historical-backfill", flag.ContinueOnError)
	var (
		coinId = fs.String("coin-id", "teritori", "coingecko id of coin to backfill")
		dbHost = fs.String("prices-db-host", "", "host postgreSQL database")
		dbPort = fs.Int("prices-db-port", -1, "port for postgreSQL database")
		dbPass = fs.String("prices-db-password", "", "password for postgreSQL database")
		dbName = fs.String("prices-db-name", "", "database name for postgreSQL")
		dbUser = fs.String("prices-db-user", "", "username for postgreSQL")
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
		panic(errors.Wrap(err, "failed to create logger"))
	}

	if *dbHost == "" || *dbUser == "" || *dbPass == "" || *dbPort < 0 {
		panic(errors.New("invalid database configuration"))
	}

	dbURL := pgutil.PostgreSQLURL(&pgutil.PostgreSQLConfig{
		User:         *dbUser,
		Password:     *dbPass,
		Port:         *dbPort,
		DatabaseName: *dbName,
		Host:         *dbHost,
	})

	logger.Info("using database", zap.String("url", urlutil.RedactPassword(&dbURL).String()))

	db, err := sql.Open("pgx", dbURL.String())
	if err != nil {
		panic(errors.Wrap(err, "failed to open db"))
	}
	defer db.Close()

	date, err := time.Parse("2-1-2006", "19-10-2022")
	if err != nil {
		panic(errors.Wrap(err, "failed to parse initial time"))
	}

	cgprices, err := coingeckoprices.NewCoinGeckoPrices()
	if err != nil {
		panic(errors.Wrap(err, "failed to create coingecko client"))
	}

	logger.Info("starting backfill", zap.Time("end-time", time.Now().Truncate(time.Hour*24)))

	for !date.After(time.Now().Truncate(time.Hour * 24)) {
		logger.Info("backfill", zap.Time("date", date))
		price, err := cgprices.Historical(*coinId, date)
		if err != nil {
			logger.Error("failed to query price", zap.String("id", *coinId), zap.Error(err))
			time.Sleep(60 * time.Second)
			continue
		}
		if err := prices_db.PriceUpsert(db, date, *coinId, price); err != nil {
			panic(errors.Wrap(err, "failed to upsert price"))
		}
		date = date.AddDate(0, 0, 1)
	}
}
