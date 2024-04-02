package shared

import (
	"bytes"
	"context"
	"encoding/base64"
	"flag"
	"fmt"
	"io"
	"log"
	mrand "math/rand"
	"net/http"
	"os"
	"strconv"

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
	"github.com/phayes/freeport"
	"go.uber.org/zap"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

var (
	port           = 0
	weshDir        = "./temp/wesh-dir/4242"
	opts           weshnet.Opts
	httpServer     http.Server
	wrappedServer  *grpcweb.WrappedGrpcServer
	ds             *badger.Datastore
	tinderDriver   *tinder.Service
	mnode          *ipfs_mobile.IpfsMobile
	mrepo          *ipfs_mobile.RepoMobile
	localdisc      *tinder.LocalDiscovery
	ipfsCoreAPI    ipfsutil.ExtendedCoreAPI
)

func RestoreAccountHandler(resp http.ResponseWriter, req *http.Request) {
	resp.Header().Set("Access-Control-Allow-Origin", "*")
	resp.Header().Set("Access-Control-Allow-Headers", "*")
	log.Println("weshnet: Import account handler")

	// Define the temporary directory for account restoration
	weshDirTemp := weshDir + "temp"

	// Ensure the temporary directory exists
	err := CheckAndProcessDir(weshDirTemp)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		log.Printf("weshnet: Error creating temporary directory: %s\n", err)
		return
	}

	// Generate options for the server using the temporary directory
	tempOpts := GenerateOptsForServer(weshDirTemp)

	// Ensure the request method is POST
	if req.Method != http.MethodPost {
		http.Error(resp, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read the base64 encoded string from the request body
	base64String, err := io.ReadAll(req.Body)
	if err != nil {
		http.Error(resp, "Bad Request", http.StatusBadRequest)
		log.Printf("weshnet: Error reading request body: %s\n", err)
		return
	}

	// Decode the base64 string
	reader := base64.NewDecoder(base64.StdEncoding, bytes.NewReader(base64String))

	// Restore the account
	err = weshnet.RestoreAccountExport(context.Background(), reader, tempOpts.IpfsCoreAPI, tempOpts.OrbitDB, tempOpts.Logger)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		log.Printf("weshnet: Error restoring account: %s\n", err)
		return
	}

	// Clean up temporary directory and rename
	err = HandleExit()
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		log.Printf("weshnet: Error handling exit: %s\n", err)
		return
	}

	// Remove temporary directory
	err = os.RemoveAll(weshDir)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		log.Println("weshnet: Error restoring: deleting folder:", err)
		return
	}
	log.Println("weshnet: Folder deleted successfully:", weshDir)

	// Rename temporary directory to original directory
	err = os.Rename(weshDirTemp, weshDir)
	if err != nil {
		http.Error(resp, err.Error(), http.StatusInternalServerError)
		log.Println("weshnet: Error restoring: renaming folder:", err)
		return
	}
	log.Println("weshnet: Folder renamed successfully:", weshDir)

	// Create a wrapped server in a separate goroutine
	go CreateWrappedServer()

	log.Println("weshnet: Restore account completed")
	resp.WriteHeader(http.StatusCreated)
}

func CheckAndProcessDir(weshDir string) error {
	_, err := os.Stat(weshDir)
	if err == nil {
		log.Printf("weshnet: Directory '%s' already exists.\n", weshDir)
		return nil
	} else if os.IsNotExist(err) {
		err = os.MkdirAll(weshDir, 0755)
		if err != nil {
			log.Println("weshnet: Error:", err)
			return err
		}
		log.Printf("weshnet: Created directory '%s'.\n", weshDir)
		return nil
	} else {
		log.Println("weshnet: Error:", err)
		return err
	}
}

func StartHTTPServer() {

	log.Println("weshnet: starting http server")
	mux := http.NewServeMux()
	mux.HandleFunc("/restore-account", RestoreAccountHandler)

	mux.Handle("/", http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {

		resp.Header().Set("Access-Control-Allow-Origin", "*")
		resp.Header().Set("Access-Control-Allow-Headers", "*")

		fmt.Printf("Request: %v\n", req)

		wrappedServer.ServeHTTP(resp, req)
	}))

	log.Println("weshnet:port:", port)

	log.Println("weshnet:address", fmt.Sprintf("127.0.0.1:%d", port))
	httpServer = http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", port),
		Handler: mux,
	}

	if err := httpServer.ListenAndServe(); err != nil {
		log.Println("weshnet: http listenAndServer err", err)
		panic(errors.Wrap(err, "failed to start http server"))
	}

}

func CreateWrappedServer() {
	log.Printf("weshnet: Using port: %d\n", port)
	grpcServer := grpc.NewServer()
	opts = GenerateOptsForServer(weshDir)

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

func GenerateOptsForServer(projectDir string) weshnet.Opts {

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

	ds, err = badger.NewDatastore(projectDir, &bopts)
	if err != nil {
		panic(errors.Wrap(err, "unable to init badger datastore"))
	}

	repo, err := ipfsutil.LoadRepoFromPath(projectDir)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo = ipfs_mobile.NewRepoMobile(projectDir, repo)
	mnode, err = ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{})
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs node"))
	}

	ipfsCoreAPI, err = ipfsutil.NewExtendedCoreAPIFromNode(mnode.IpfsNode)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs core api"))
	}

	host := mnode.PeerHost()

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

	opts = weshnet.Opts{
		Logger:        logger,
		TinderService: tinderDriver,
		IpfsCoreAPI:   ipfsCoreAPI,
		RootDatastore: ds,
	}

	opts.ServiceOptsApplyDefaults(context.Background())

	return opts

}

func CheckAndUpdatePortFromArgs() int {
	args := os.Args[1:]

	if len(args) != 0 {
		parsedPort, err := strconv.Atoi(args[0])
		if err != nil {
			log.Println("weshnet: Invalid port number:", args[0])

		} else {
			port = parsedPort
			return port
		}
	}
	port = 4242
	return port
}

func CheckAndUpdateFreePort() int {
	if port != 0 {
		return port
	}

	firstPort, err := freeport.GetFreePort()
	if err == nil {
		port = firstPort
	} else {
		secondPort, err := freeport.GetFreePort()

		if err == nil {
			port = secondPort
		}
	}
	return port
}
type BootParams struct {
    Path       string
    MultiAddrs []string
}

func BootWesh(path string) {
	weshDir = path
	log.Println("weshnet: Boot Wesh: weshDir", weshDir)
	CreateWrappedServer()
	go StartHTTPServer()
}

func HandleExit() error {
	log.Println("weshnet: Handle exit")
	var finalErr error

	// Close the Badger datastore
	if ds != nil {
		err := ds.Close()
		if err != nil {
			log.Println("weshnet: Error while closing Badger datastore:", err)
			finalErr = err
		}
	}
	log.Println("weshnet: Closed ds")

	// Close the Tinder discovery service
	if tinderDriver != nil {
		err := tinderDriver.Close()
		if err != nil {
			log.Println("weshnet: Error while closing Tinder discovery service:", err)
			finalErr = err
		}
	}

	log.Println("weshnet: Closed tinderDriver")

	// Close the IPFS node
	if mnode != nil {
		err := mnode.Close()
		if err != nil {
			log.Println("weshnet: Error while closing IPFS node:", err)
			finalErr = err
		}
	}

	log.Println("weshnet: Closed mnode")

	// Close the IPFS repo
	if mrepo != nil {
		err := mrepo.Close()
		if err != nil {
			log.Println("weshnet: Error while closing IPFS repo:", err)
			finalErr = err
		}
	}

	log.Println("weshnet: Closed mrepo")

	// Close the local discovery service
	if localdisc != nil {
		err := localdisc.Close()
		if err != nil {
			log.Println("weshnet: Error while closing local discovery service:", err)
			finalErr = err
		}
	}

	log.Println("weshnet: Closed localdisc")

	// Close the IPFS core API
	if ipfsCoreAPI != nil {
		err := ipfsCoreAPI.Close()
		if err != nil {
			log.Println("weshnet: Error while closing IPFS core API:", err)
			finalErr = err
		}
	}

	log.Println("weshnet: Closed ipfsCoreAPI")

	log.Println("weshnet: Handle exit completed")

	return finalErr
}

func Shutdown() {
	HandleExit()
	httpServer.Close()
}
