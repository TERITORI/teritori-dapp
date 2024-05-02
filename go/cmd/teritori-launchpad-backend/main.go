package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpad"
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func main() {
	fs := flag.NewFlagSet("teritori-dapp-backend", flag.ContinueOnError)
	var (
		enableTls       = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
		tlsCertFilePath = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
		tlsKeyFilePath  = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
		dbPath          = fs.String("db-path", "launchpad.db", "path to sqlite db")
		networksFile    = fs.String("networks-file", "networks.json", "path to networks config file")
		pinataJWT       = fs.String("pinata-jwt", "", "Pinata admin JWT token")
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

	if *pinataJWT == "" {
		logger.Warn("missing PINATA_JWT, feed pinning will be disabled")
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

	if dbPath == nil {
		panic(errors.New("missing Database configuration"))
	}

	// Setup the DB + auto migrate
	var launchpadModels = []interface{}{
		// users
		&indexerdb.User{},

		// launchpad
		&LaunchpadProject{},
		&LaunchpadToken{},
		&LaunchpadWhitelist{},
	}

	launchpadDB, err := indexerdb.NewSQLiteDB(*dbPath)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	launchpadDB.AutoMigrate(launchpadModels...)

	port := 9080
	if *enableTls {
		port = 9081
	}

	launchpadSvc := launchpad.NewLaunchpadService(context.Background(), &launchpad.Config{
		Logger:       logger,
		IndexerDB:    launchpadDB,
		PinataJWT:    *pinataJWT,
		NetworkStore: netstore,
	})

	server := grpc.NewServer()
	launchpadpb.RegisterLaunchpadServiceServer(server, launchpadSvc)

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
		Addr:    fmt.Sprintf(":%d", port),
		Handler: http.HandlerFunc(handler),
	}

	logger.Info(fmt.Sprintf("Starting server. http port: %d, with TLS: %v", port, *enableTls))

	if *enableTls {
		if err := httpServer.ListenAndServeTLS(*tlsCertFilePath, *tlsKeyFilePath); err != nil {
			panic(fmt.Errorf("failed starting http2 server: %v", err))
		}
	} else {
		if err := httpServer.ListenAndServe(); err != nil {
			panic(fmt.Errorf("failed starting http server: %v", err))
		}
	}
}
