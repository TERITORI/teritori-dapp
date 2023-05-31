package main

import (
	"context"
	"flag"
	"fmt"
	mrand "math/rand"
	"net/http"
	"os"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	ds "github.com/ipfs/go-datastore"
	ds_sync "github.com/ipfs/go-datastore/sync"
	"github.com/peterbourgon/ff/v3"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"moul.io/srand"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

func main() {
	fs := flag.NewFlagSet("weshd", flag.ContinueOnError)
	var (
		port = fs.Int("port", 4243, "port")
	)
	if err := ff.Parse(fs, os.Args[1:]); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	logger.Info("weshd", zap.Int("port", *port))

	grpcServer := grpc.NewServer()

	rng := mrand.New(mrand.NewSource(srand.MustSecure())) // nolint:gosec // we need to use math/rand here, but it is seeded from crypto/rand
	drivers := []tinder.IDriver{}

	// setup ipfs node
	dsync := ds_sync.MutexWrap(ds.NewMapDatastore())

	repo, err := ipfsutil.CreateMockedRepo(dsync)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo := ipfs_mobile.NewRepoMobile("", repo)
	mnode, err := ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{
		ExtraOpts: map[string]bool{
			"pubsub": true,
		},
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs node"))
	}

	ipfsCoreAPI, err := ipfsutil.NewExtendedCoreAPIFromNode(mnode.IpfsNode)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs core api"))
	}
	host := mnode.PeerHost()

	// setup loac disc
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
		DatastoreDir:  weshnet.InMemoryDirectory,
		TinderService: tinderDriver,
		IpfsCoreAPI:   ipfsCoreAPI,
		RootDatastore: dsync,
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create weshnet server"))
	}
	// FIXME: svc.Close?

	protocoltypes.RegisterProtocolServiceServer(grpcServer, svc)

	wrappedServer := grpcweb.WrapServer(grpcServer)
	handler := func(resp http.ResponseWriter, req *http.Request) {
		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")
		logger.Debug(fmt.Sprintf("Request: %v", req))
		wrappedServer.ServeHTTP(resp, req)
	}

	httpServer := http.Server{
		Addr:    fmt.Sprintf(":%d", *port),
		Handler: http.HandlerFunc(handler),
	}

	if err := httpServer.ListenAndServe(); err != nil {
		panic(errors.Wrap(err, "failed to start http server"))
	}
}
