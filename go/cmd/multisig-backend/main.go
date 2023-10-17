package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisig"
	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/peterbourgon/ff/v3"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func main() {
	fs := flag.NewFlagSet("cosmos-multisig-backend", flag.ContinueOnError)
	var (
		portFlag   = fs.Int("port", 9091, "port for grpc-web server")
		dbPathFlag = fs.String("db-path", "multisig.db", "path to database")
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

	port := *portFlag
	dbPath := *dbPathFlag

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	svc, err := multisig.NewMultisigService(multisig.MultisigServiceOpts{
		DBPath: dbPath,
		Logger: logger,
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create multisig service"))
	}

	server := grpc.NewServer()
	multisigpb.RegisterMultisigServiceServer(server, svc)

	wrappedServer := grpcweb.WrapServer(server,
		grpcweb.WithWebsockets(true),
		grpcweb.WithWebsocketOriginFunc(func(*http.Request) bool { return true }))

	handler := func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")
		logger.Debug("request", zap.String("url", req.URL.String()))
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: http.HandlerFunc(handler),
	}

	logger.Info(fmt.Sprintf("Starting server. http port: %d", port))

	if err := httpServer.ListenAndServe(); err != nil {
		panic(fmt.Errorf("failed starting http server: %v", err))
	}
}
