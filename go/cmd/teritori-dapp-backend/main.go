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
	"github.com/TERITORI/teritori-dapp/go/pkg/dao"
	"github.com/TERITORI/teritori-dapp/go/pkg/daopb"
	"github.com/TERITORI/teritori-dapp/go/pkg/feed"
	"github.com/TERITORI/teritori-dapp/go/pkg/feedpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelance"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelancepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplace"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2e"
	"github.com/TERITORI/teritori-dapp/go/pkg/p2epb"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelance"
	"github.com/TERITORI/teritori-dapp/go/pkg/freelancepb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func main() {
	fs := flag.NewFlagSet("teritori-dapp-backend", flag.ContinueOnError)
	var (
		enableTls                = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
		tlsCertFilePath          = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
		tlsKeyFilePath           = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
		dbHost                   = fs.String("db-dapp-host", "", "host postgreSQL database")
		dbPort                   = fs.String("db-dapp-port", "", "port for postgreSQL database")
		dbPass                   = fs.String("postgres-password", "", "password for postgreSQL database")
		dbName                   = fs.String("database-name", "", "database name for postgreSQL")
		dbUser                   = fs.String("postgres-user", "", "username for postgreSQL")
		whitelistString          = fs.String("teritori-collection-whitelist", "", "whitelist of collections to return")
		airtableAPIKey           = fs.String("airtable-api-key", "", "api key of airtable for home and launchpad")
		airtableAPIKeydappsStore = fs.String("airtable-api-key-dapps-store", "", "api key of airtable for the dapps store")
		networksFile             = fs.String("networks-file", "networks.json", "path to networks config file")
		pinataJWT                = fs.String("pinata-jwt", "", "Pinata admin JWT token")
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

	// warn about missing features
	if *airtableAPIKey == "" {
		logger.Warn("missing AIRTABLE_API_KEY, news and banners will be disabled")
	}
	if *airtableAPIKeydappsStore == "" {
		logger.Warn("missing AIRTABLE_API_KEY_DAPPS_STORE, dapp store will be disabled")
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

	if dbHost == nil || dbUser == nil || dbPass == nil || dbName == nil || dbPort == nil {
		panic(errors.New("missing Database configuration"))
	}
	dataConnexion := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		*dbHost, *dbUser, *dbPass, *dbName, *dbPort)
	indexerDB, err := indexerdb.NewPostgresDB(dataConnexion)
	if err != nil {
		panic(errors.Wrap(err, "failed to access db"))
	}

	err = indexerdb.MigrateDB(indexerDB)
  if err != nil {
  		panic(errors.Wrap(err, "failed migrate database models"))
  }

	port := 9090
	if *enableTls {
		port = 9091
	}

	whitelist := strings.Split(*whitelistString, ",")
	for i, elem := range whitelist {
		whitelist[i] = strings.TrimFunc(elem, unicode.IsSpace)
	}

	marketplaceSvc, err := marketplace.NewMarketplaceService(context.Background(), &marketplace.Config{
		Logger:                   logger,
		IndexerDB:                indexerDB,
		Whitelist:                whitelist,
		AirtableAPIKey:           *airtableAPIKey,
		AirtableAPIKeydappsStore: *airtableAPIKeydappsStore,
		NetworkStore:             netstore,
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create marketplace service"))
	}

	p2eSvc := p2e.NewP2eService(context.Background(), &p2e.Config{
		Logger:    logger,
		IndexerDB: indexerDB,
	})
  freelanceSvc := freelance.NewFreelanceService(context.Background(), &freelance.Config{
    Logger:    logger,
    IndexerDB: indexerDB,
  })

	feedSvc := feed.NewFeedService(context.Background(), &feed.Config{
		Logger:    logger,
		IndexerDB: indexerDB,
		PinataJWT: *pinataJWT,
	})

	daoSvc := dao.NewDAOService(context.Background(), &dao.Config{
		Logger:    logger,
		IndexerDB: indexerDB,
		NetStore:  &netstore,
	})

	server := grpc.NewServer()
	marketplacepb.RegisterMarketplaceServiceServer(server, marketplaceSvc)
	p2epb.RegisterP2EServiceServer(server, p2eSvc)
	daopb.RegisterDAOServiceServer(server, daoSvc)
	freelancepb.RegisterFreelanceServiceServer(server, freelanceSvc)
	feedpb.RegisterFeedServiceServer(server, feedSvc)

	wrappedServer := grpcweb.WrapServer(server,
		grpcweb.WithWebsockets(true),
		grpcweb.WithWebsocketOriginFunc(func(*http.Request) bool { return true }))

	handler := func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")
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
