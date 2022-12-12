package main

import (
	"database/sql"
	"flag"
	"os"
	"strings"
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
	fs := flag.NewFlagSet("prices-ohlc-refresh", flag.ContinueOnError)
	var (
		coinIds = fs.String("coin-ids", "teritori,cosmos", "coingecko ids of coins to refresh")
		dbHost  = fs.String("prices-db-host", "", "host postgreSQL database")
		dbPort  = fs.Int("prices-db-port", -1, "port for postgreSQL database")
		dbPass  = fs.String("prices-db-password", "", "password for postgreSQL database")
		dbName  = fs.String("prices-db-name", "", "database name for postgreSQL")
		dbUser  = fs.String("prices-db-user", "", "username for postgreSQL")
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

	cgprices, err := coingeckoprices.NewCoinGeckoPrices()
	if err != nil {
		panic(errors.Wrap(err, "failed to create coingecko client"))
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

	coinIdsSlice := strings.Split(*coinIds, ",")

outer:
	for {
		for _, coinId := range coinIdsSlice {
			ohlc, err := cgprices.OHLC(coinId, 1)
			if err != nil {
				logger.Error("failed to query last day ohlc", zap.String("id", coinId), zap.Error(err))
				time.Sleep(60 * time.Second)
				continue outer
			}
			if len(ohlc) == 0 {
				panic(errors.New("no ohlc data"))
			}
			for _, p := range ohlc {
				if p.Time.After(time.Now()) {
					continue
				}
				if err := prices_db.PriceUpsert(db, p.Time, coinId, p.Open); err != nil {
					panic(errors.Wrap(err, "failed to upsert price"))
				}
			}
		}
		time.Sleep(5 * time.Minute)
	}
}
