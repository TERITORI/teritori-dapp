package main

import (
	"context"
	"flag"
	"fmt"
	"net"
	"os/signal"
	"strconv"
	"sync"
	"syscall"

	mrand "math/rand"
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
	"google.golang.org/grpc/reflection"

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

func startServer() func() error {

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	logger.Info("server config", zap.Int("port", port))

	fs := flag.NewFlagSet("weshd", flag.ContinueOnError)

	if err := ff.Parse(fs, os.Args[1:]); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
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

	protocoltypes.RegisterProtocolServiceServer(grpcServer, svc)
	reflection.Register(grpcServer)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(errors.Wrap(err, "failed to listen"))
	}

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		if err := grpcServer.Serve(lis); err != nil {
			panic(err)
		}
		wg.Done()
	}()
	return func() error {
		grpcServer.GracefulStop()
		wg.Wait()
		return svc.Close()
	}
}

func main() {

	checkAndUpdatePortFromArgs()
	checkAndProcessDir()

	stopServer := startServer()

	interruptChannel := make(chan os.Signal, 1)
	signal.Notify(interruptChannel, os.Interrupt, syscall.SIGTERM)

	<-interruptChannel

	fmt.Println("Termination signal received. Stopping the program.")

	if err := stopServer(); err != nil {
		panic(err)
	}

	fmt.Println("Server stopped gracefully.")
}
