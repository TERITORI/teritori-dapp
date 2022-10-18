package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplace"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

var (
	graphqlEndpoint = "https://graph.65.108.73.219.nip.io/v1"
)

func main() {
	fs := flag.NewFlagSet("teritori-dapp-backend", flag.ContinueOnError)
	var (
		dbPath             = fs.String("db-path", "", "path to the database file")
		enableTls          = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
		tlsCertFilePath    = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
		tlsKeyFilePath     = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
		tnsContractAddress = fs.String("teritori-name-service-contract-address", "", "address of the teritori name service contract")
		tnsDefaultImageURL = fs.String("teritori-name-service-default-image-url", "", "url of a fallback image for TNS")
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

	if *dbPath == "" {
		panic(errors.New("missing db-path flag"))
	}

	port := 9090
	if *enableTls {
		port = 9091
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	indexerDB, err := indexerdb.NewSQLiteDB(*dbPath)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	svc := marketplace.NewMarketplaceService(context.Background(), &marketplace.Config{
		Logger:             logger,
		IndexerDB:          indexerDB,
		GraphqlEndpoint:    graphqlEndpoint,
		TNSContractAddress: *tnsContractAddress,
		TNSDefaultImageURL: *tnsDefaultImageURL,
	})

	server := grpc.NewServer()
	marketplacepb.RegisterMarketplaceServiceServer(server, svc)

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
