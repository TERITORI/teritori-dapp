package main

import (
	"database/sql"
	"flag"
	"os"

	"github.com/TERITORI/teritori-dapp/go/internal/pgutil"
	"github.com/TERITORI/teritori-dapp/go/internal/urlutil"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	migrate "github.com/rubenv/sql-migrate"
	"go.uber.org/zap"
)

func main() {
	fs := flag.NewFlagSet("prices-migrate", flag.ContinueOnError)
	var (
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

	migrations := &migrate.MemoryMigrationSource{
		Migrations: []*migrate.Migration{
			{
				Id: "1_init",
				Up: []string{`
          CREATE TABLE prices (
            timestamp timestamp,
            currency text,
            usd numeric,
            PRIMARY KEY (timestamp, currency)
          )
        `},
				Down: []string{`
          DROP TABLE prices
        `},
			},
		},
	}
	n, err := migrate.Exec(db, "postgres", migrations, migrate.Up)
	if err != nil {
		panic(errors.Wrap(err, "failed to migrate db"))
	}

	logger.Info("applied migrations", zap.Int("count", n))
}
