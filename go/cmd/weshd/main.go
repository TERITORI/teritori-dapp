package main

import (
	"context"
	"flag"
	"fmt"
	"os/signal"
	"strconv"
	"syscall"

	mrand "math/rand"
	"net/http"
	"os"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"moul.io/srand"

	"github.com/dgraph-io/badger/options"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/peterbourgon/ff/v3"
	"go.uber.org/zap"
	"google.golang.org/grpc"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

var port = 4242
var weshDir = "./temp/wesh-dir/4242"

func checkAndUpdatePortFromArgs() {
	args := os.Args[1:]

	if len(args) != 0 {
		parsedPort, err := strconv.Atoi(args[0])
		if err != nil {
			fmt.Println("Invalid port number:", args[0])
			return
		}
		port = parsedPort
	}
}

func checkAndProcessDir() {

	basePath := "./temp/wesh-dir"
	weshDir = basePath + "/" + strconv.Itoa(port)

	err := os.MkdirAll(weshDir, 0755)

	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	fmt.Printf("Directory '%s' and its parent directories have been created.\n", weshDir)
}

func startHTTPServer() {

	fmt.Printf("Using port: %d\n", port)

	fs := flag.NewFlagSet("weshd", flag.ContinueOnError)

	if err := ff.Parse(fs, os.Args[1:]); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	logger.Info("weshd", zap.Int("port", port))

	grpcServer := grpc.NewServer()

	rng := mrand.New(mrand.NewSource(srand.MustSecure()))
	drivers := []tinder.IDriver{}

	bopts := badger.DefaultOptions
	bopts.ValueLogLoadingMode = options.FileIO
	ds, err := badger.NewDatastore(weshDir, &bopts)
	if err != nil {
		panic(errors.Wrap(err, "unable to init badger datastore"))
	}

	repo, err := ipfsutil.LoadRepoFromPath(weshDir)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo := ipfs_mobile.NewRepoMobile(weshDir, repo)
	mnode, err := ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{})
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs node"))
	}

	ipfsCoreAPI, err := ipfsutil.NewExtendedCoreAPIFromNode(mnode.IpfsNode)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs core api"))
	}

	host := mnode.PeerHost()

	localdisc, err := tinder.NewLocalDiscovery(logger, host, rng)
	if err != nil {
		panic(errors.Wrap(err, "failed to create local discovery"))
	}
	drivers = append(drivers, localdisc)

	if mnode != nil {
		dhtdisc := tinder.NewRoutingDiscoveryDriver("dht", mnode.DHT)
		drivers = append(drivers, dhtdisc)

	}
	tinderDriver, err := tinder.NewService(host, logger, drivers...)
	if err != nil {
		panic(errors.Wrap(err, "failed to create tinder driver"))
	}

	svc, err := weshnet.NewService(weshnet.Opts{
		Logger:        logger,
		TinderService: tinderDriver,
		IpfsCoreAPI:   ipfsCoreAPI,
		RootDatastore: ds,
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create weshnet server"))
	}
	defer svc.Close()

	protocoltypes.RegisterProtocolServiceServer(grpcServer, svc)
	wrappedServer := grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(string) bool { return true }), // @FIXME: this is very insecure
		grpcweb.WithWebsockets(true),
	)
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

	if err := httpServer.ListenAndServe(); err != nil {
		panic(errors.Wrap(err, "failed to start http server"))
	}

}

func main() {

	checkAndUpdatePortFromArgs()
	checkAndProcessDir()

	stopHTTPServer := make(chan struct{})

	go func() {
		startHTTPServer()
		close(stopHTTPServer)
	}()

	interruptChannel := make(chan os.Signal, 1)
	signal.Notify(interruptChannel, os.Interrupt, syscall.SIGTERM)

	<-interruptChannel

	fmt.Println("Ctrl+C received. Stopping the program.")

	close(stopHTTPServer)

	fmt.Println("Program has exited.")
}
