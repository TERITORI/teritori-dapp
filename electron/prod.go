package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"sync"
	"syscall"

	mrand "math/rand"

	"github.com/dgraph-io/badger/options"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/mitchellh/go-homedir"
	"moul.io/srand"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"github.com/peterbourgon/ff/v3"
	"go.uber.org/zap"
	"google.golang.org/grpc"

 
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

// Application Vars

var (
	fs           = flag.NewFlagSet(os.Args[0], flag.ContinueOnError)
	debug        = fs.Bool("d", false, "enables the debug mode")
	weshDir      = ""
	ds           *badger.Datastore
	tinderDriver *tinder.Service
	mnode        *ipfs_mobile.IpfsMobile
	mrepo        *ipfs_mobile.RepoMobile
	localdisc    *tinder.LocalDiscovery
	ipfsCoreAPI  ipfsutil.ExtendedCoreAPI
)

 
func handleExit() {
	fmt.Println("Handle exit")
	// Close the Badger datastore
	if ds != nil {
		err := ds.Close()
		if err != nil {
			fmt.Println("Error while closing Badger datastore:", err)
		}
	}

	// Close the Tinder discovery service
	if tinderDriver != nil {
		err := tinderDriver.Close()
		if err != nil {
			fmt.Println("Error while closing Tinder discovery service:", err)
		}
	}

	// Close the IPFS node
	if mnode != nil {
		err := mnode.Close()
		if err != nil {
			fmt.Println("Error while closing IPFS node:", err)
		}
	}

	// Close the IPFS repo
	if mrepo != nil {
		err := mrepo.Close()
		if err != nil {
			fmt.Println("Error while closing IPFS repo:", err)
		}
	}

	// Close the local discovery service
	if localdisc != nil {
		err := localdisc.Close()
		if err != nil {
			fmt.Println("Error while closing local discovery service:", err)
		}
	}

	// Close the local discovery service
	if ipfsCoreAPI != nil {
		err := ipfsCoreAPI.Close()
		if err != nil {
			fmt.Println("Error while ipfsCoreAPI:", err)
		}
	}

}

func checkAndCreateDir() {

	homeDir, err := homedir.Dir()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	dir := "teritori-electron-wesh"

	weshDir = filepath.Join(homeDir, dir)

	// Check if the directory already exists
	_, err = os.Stat(weshDir)
	if err == nil {
		fmt.Printf("Directory '%s' already exists.\n", weshDir)
	} else if os.IsNotExist(err) {
		// Create the new directory
		err = os.Mkdir(weshDir, 0755)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}
		fmt.Printf("Created directory '%s'.\n", weshDir)
	} else {
		fmt.Println("Error:", err)
	}
}

func wesh() {
	var port int
	args := os.Args[1:]

	if len(args) != 0 {
		// Attempt to parse the first argument as an integer
		parsedPort, err := strconv.Atoi(args[0])
		if err != nil {
			fmt.Println("Invalid port number:", args[0])
			return
		}
		port = parsedPort
	}
	fmt.Printf("golang port: '%d'.\n", port)
	checkAndCreateDir()

	fs := flag.NewFlagSet("weshd", flag.ContinueOnError)

	if err := ff.Parse(fs, os.Args[1:]); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	grpcServer := grpc.NewServer()

	rng := mrand.New(mrand.NewSource(srand.MustSecure())) // nolint:gosec // we need to use math/rand here, but it is seeded from crypto/rand
	drivers := []tinder.IDriver{}

	// setup ipfs node
	bopts := badger.DefaultOptions
	bopts.ValueLogLoadingMode = options.FileIO
	ds, err = badger.NewDatastore(weshDir, &bopts)
	if err != nil {
		panic(errors.Wrap(err, "unable to init badger datastore"))
	}

	defer ds.Close()

	repo, err := ipfsutil.LoadRepoFromPath(weshDir)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo = ipfs_mobile.NewRepoMobile(weshDir, repo)
	mnode, err = ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{})
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs node"))
	}

	ipfsCoreAPI, err = ipfsutil.NewExtendedCoreAPIFromNode(mnode.IpfsNode)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs core api"))
	}

	host := mnode.PeerHost()

	// setup loac disc
	localdisc, err = tinder.NewLocalDiscovery(logger, host, rng)
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
	
	// Create a channel to receive the interrupt signal.
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	// Create a WaitGroup to manage goroutines.
	var wg sync.WaitGroup

	// Function to handle cleanup.
	cleanup := func() {
		fmt.Println("Cleanup code here...")
		handleExit()
		// You can add any cleanup operations you need here.
	}

	// Start a goroutine to wait for the interrupt signal.
	go func() {
		<-interrupt
		fmt.Println("Received interrupt signal. Cleaning up...")
		cleanup()
		os.Exit(1)
	}()

	wg.Add(1)
	go wesh()
	wg.Wait()

}
