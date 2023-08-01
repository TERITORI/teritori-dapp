package main

import (
	"fmt"
	"net/http"

	"github.com/TERITORI/teritori-dapp/go/pkg/multisig"
	"github.com/TERITORI/teritori-dapp/go/pkg/multisigpb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func main() {
	port := 9091

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	svc, err := multisig.NewMultisigService(multisig.MultisigServiceOpts{})
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
