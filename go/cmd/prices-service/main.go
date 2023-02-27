package main

import (
	"database/sql"
	"flag"
	"fmt"
	"net"
	"net/http"
	"os"

	"github.com/TERITORI/teritori-dapp/go/internal/pgutil"
	"github.com/TERITORI/teritori-dapp/go/internal/urlutil"
	"github.com/TERITORI/teritori-dapp/go/pkg/prices"
	"github.com/TERITORI/teritori-dapp/go/pkg/pricespb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func main() {
	fs := flag.NewFlagSet("prices-service", flag.ContinueOnError)
	var (
		dbHost   = fs.String("prices-db-host", "", "host postgreSQL database")
		dbPort   = fs.Int("prices-db-port", -1, "port for postgreSQL database")
		dbPass   = fs.String("prices-db-password", "", "password for postgreSQL database")
		dbName   = fs.String("prices-db-name", "", "database name for postgreSQL")
		dbUser   = fs.String("prices-db-user", "", "username for postgreSQL")
		webPort  = fs.Int("prices-grpc-web-port", 9090, "grpc-web port")
		grpcPort = fs.Int("prices-grpc-port", 9091, "grpc port")
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

	svc, err := prices.NewPricesService(db)
	if err != nil {
		panic(errors.Wrap(err, "failed to create prices service"))
	}

	server := grpc.NewServer()
	pricespb.RegisterPricesServiceServer(server, svc)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *grpcPort))
	if err != nil {
		panic(errors.Wrap(err, "failed to create grpc listener"))
	}

	wrappedServer := grpcweb.WrapServer(server,
		grpcweb.WithWebsockets(true),
		grpcweb.WithWebsocketOriginFunc(func(*http.Request) bool { return true }))

	handler := func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")
		logger.Debug(fmt.Sprintf("Request: %v", req))
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", *webPort),
		Handler: http.HandlerFunc(handler),
	}

	logger.Info(fmt.Sprintf("starting server. grpc-web port: %d, grpc port: %d", *webPort, *grpcPort))

	go func() {
		err := server.Serve(lis)
		if err != nil {
			logger.Error("grpc server failed", zap.Error(err))
		}
	}()

	if err := httpServer.ListenAndServe(); err != nil {
		panic(errors.Wrap(err, "grpc-web server failed"))
	}
}
