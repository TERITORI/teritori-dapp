package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"strings"
	"unicode"

	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplace"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2epb"
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
		enableTls          = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
		tlsCertFilePath    = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
		tlsKeyFilePath     = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
		tnsContractAddress = fs.String("teritori-name-service-contract-address", "", "address of the teritori name service contract")
		tnsDefaultImageURL = fs.String("teritori-name-service-default-image-url", "", "url of a fallback image for TNS")
		riotGameStartedAt  = fs.String("the-riot-game-started-at", "", "date when the riot game starts")
		dbHost             = fs.String("db-dapp-host", "", "host postgreSQL database")
		dbPort             = fs.String("db-dapp-port", "", "port for postgreSQL database")
		dbPass             = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName             = fs.String("database-name", "", "database name for postgreSQL")
		dbUser             = fs.String("postgres-user", "", "username for postgreSQL")
		theGraphEndpoint   = fs.String("ethereum-graph-endpoint", "", "the graph url")
		whitelistString    = fs.String("teritori-collection-whitelist", "", "whitelist of collections to return")
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

	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	indexerDB, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}
	port := 9090
	if *enableTls {
		port = 9091
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	whitelist := strings.Split(*whitelistString, ",")
	for i, elem := range whitelist {
		whitelist[i] = strings.TrimFunc(elem, unicode.IsSpace)
	}

	if riotGameStartedAt == nil {
		panic(errors.New("missing riot-game-started-at configuration"))
	}

	marketplaceSvc := marketplace.NewMarketplaceService(context.Background(), &marketplace.Config{
		Logger:             logger,
		IndexerDB:          indexerDB,
		GraphqlEndpoint:    graphqlEndpoint,
		TNSContractAddress: *tnsContractAddress,
		TNSDefaultImageURL: *tnsDefaultImageURL,
		Whitelist:          whitelist,
		TheGraphEndpoint:   *theGraphEndpoint,
	})
	p2eSvc := p2e.NewP2eService(context.Background(), &p2e.Config{
		Logger:            logger,
		IndexerDB:         indexerDB,
		RiotGameStartedAt: *riotGameStartedAt,
	})

	server := grpc.NewServer()
	marketplacepb.RegisterMarketplaceServiceServer(server, marketplaceSvc)
	p2epb.RegisterP2EServiceServer(server, p2eSvc)

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
