package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"flag"
	"fmt"
	"io"
	mrand "math/rand"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"google.golang.org/grpc"
	"moul.io/srand"

	"github.com/dgraph-io/badger/options"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/peterbourgon/ff/v3"
	"go.uber.org/zap"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

var (
	port           = 4242
	weshDir        = "./temp/wesh-dir/4242"
	ipfsCoreAPI    ipfsutil.ExtendedCoreAPI
	opts           weshnet.Opts
	httpServer     http.Server
	basePath       = "./temp/wesh-dir"
	stopHTTPServer chan struct{}
	wrappedServer *grpcweb.WrappedGrpcServer
)

func generateOptsForServer(projectDir string) weshnet.Opts {

	fs := flag.NewFlagSet("weshd", flag.ContinueOnError)

	if err := ff.Parse(fs, os.Args[1:]); err != nil {
		panic(errors.Wrap(err, "failed to parse flags"))
	}

	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(errors.Wrap(err, "failed to create logger"))
	}

	logger.Info("weshd", zap.Int("port", port))

	rng := mrand.New(mrand.NewSource(srand.MustSecure()))
	drivers := []tinder.IDriver{}

	bopts := badger.DefaultOptions
	bopts.ValueLogLoadingMode = options.FileIO
	ds, err := badger.NewDatastore(projectDir, &bopts)
	if err != nil {
		panic(errors.Wrap(err, "unable to init badger datastore"))
	}



	repo, err := ipfsutil.LoadRepoFromPath(projectDir)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo := ipfs_mobile.NewRepoMobile(projectDir, repo)
	mnode, err := ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{})
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs node"))
	}

	ipfsCoreAPI, err = ipfsutil.NewExtendedCoreAPIFromNode(mnode.IpfsNode)
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

	opts = weshnet.Opts{
		Logger:        logger,
		TinderService: tinderDriver,
		IpfsCoreAPI:   ipfsCoreAPI,
		RootDatastore: ds,
	}

	opts.ServiceOptsApplyDefaults(context.Background())

	return opts

}

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

func createWrappedServer() {
	fmt.Printf("Using port: %d\n", port)
	grpcServer := grpc.NewServer()
	opts = generateOptsForServer(weshDir)

	svc, err := weshnet.NewService(opts)
	if err != nil {
		panic(errors.Wrap(err, "failed to create weshnet server"))
	}
	// defer svc.Close()

	protocoltypes.RegisterProtocolServiceServer(grpcServer, svc)
	wrappedServer = grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(string) bool { return true }), // @FIXME: this is very insecure
		grpcweb.WithWebsockets(true),
	)
}


func importAccountHandler(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", "*")
	resp.Header().Set("Access-Control-Allow-Headers", "*")
	fmt.Printf("Import account handlder")
	weshDirReal := basePath + "/" + strconv.Itoa(port)
	weshDir := weshDirReal + "temp"
	checkAndProcessDir(weshDir)
	tempOpts := generateOptsForServer(weshDir)
	if req.Method != http.MethodPost {
		resp.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	base64String, err := io.ReadAll(req.Body)
	if err != nil {
		resp.WriteHeader(http.StatusBadRequest)
		return
	}

	reader := base64.NewDecoder(base64.StdEncoding, bytes.NewReader(base64String))

	err = weshnet.RestoreAccountExport(context.Background(), reader, tempOpts.IpfsCoreAPI, tempOpts.OrbitDB, tempOpts.Logger)
	if err != nil {

		resp.WriteHeader(http.StatusInternalServerError)
		return
	}

	resp.WriteHeader(http.StatusCreated)
	go func() {

		err = opts.OrbitDB.Close()
		if err != nil {
			fmt.Printf("Error closing orbit db: %s\n", err)
		}

		err = opts.RootDatastore.Close()
		if err != nil {
			fmt.Printf("Error closing orbit db: %s\n", err)
		}


		err = os.RemoveAll(weshDirReal)
		if err != nil {
			fmt.Println("Error deleting folder:", err)
			return
		}
		fmt.Println("Folder deleted successfully:", weshDirReal)

		err = os.Rename(weshDir, weshDirReal)
		if err != nil {
			fmt.Println("Error renaming folder:", err)
			return
		}
		fmt.Println("Folder renamed successfully:", weshDir)
		createWrappedServer()
 
		 
	}()
}

func checkAndProcessDir(weshDir string) {

	err := os.MkdirAll(weshDir, 0755)

	if err != nil {
		fmt.Println("Error creating directory:", err)
		return
	}

	fmt.Printf("Directory '%s' and its parent directories have been created.\n", weshDir)
}




func startHTTPServer() {

	mux := http.NewServeMux()
	mux.HandleFunc("/import-account", importAccountHandler)

	mux.Handle("/", http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {

		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")

		fmt.Printf("Request: %v\n", req)

		wrappedServer.ServeHTTP(resp, req)
	}))
	httpServer = http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: mux,
	}

	if err := httpServer.ListenAndServe(); err != nil {
		panic(errors.Wrap(err, "failed to start http server"))
	}

}

func main() {

	checkAndUpdatePortFromArgs()
	checkAndProcessDir(basePath + "/" + strconv.Itoa(port))
	weshDir = basePath + "/" + strconv.Itoa(port)
	createWrappedServer()

	stopHTTPServer = make(chan struct{})

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
