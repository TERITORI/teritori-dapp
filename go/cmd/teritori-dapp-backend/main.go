package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplace"
	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

var (
	enableTls       = flag.Bool("enable_tls", false, "Use TLS - required for HTTP2.")
	tlsCertFilePath = flag.String("tls_cert_file", "../../misc/localhost.crt", "Path to the CRT/PEM file.")
	tlsKeyFilePath  = flag.String("tls_key_file", "../../misc/localhost.key", "Path to the private key file.")
)

func main() {
	flag.Parse()

	port := 9090
	if *enableTls {
		port = 9091
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	server := grpc.NewServer()
	marketplacepb.RegisterMarketplaceServiceServer(server, marketplace.NewMarketplaceService(context.TODO(), logger))

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
