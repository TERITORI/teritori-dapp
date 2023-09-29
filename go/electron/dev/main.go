package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	mrand "math/rand"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	"github.com/dgraph-io/badger/options"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/peterbourgon/ff/v3"
	"github.com/phayes/freeport"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"moul.io/srand"
)

var port = 4254;
var path = "./wesh-electron-dev-dir/"

func checkFreePort() {
	firstPort, err := freeport.GetFreePort()
	if err == nil {
		port = firstPort
	}

}


func wesh() {
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

	rng := mrand.New(mrand.NewSource(srand.MustSecure())) // nolint:gosec // we need to use math/rand here, but it is seeded from crypto/rand
	drivers := []tinder.IDriver{}

	// setup ipfs node
	bopts := badger.DefaultOptions
	bopts.ValueLogLoadingMode = options.FileIO
	ds, err := badger.NewDatastore(path, &bopts)
	if err != nil {
		panic(errors.Wrap(err, "unable to init badger datastore"))
	}

	repo, err := ipfsutil.LoadRepoFromPath(path)
	if err != nil {
		panic(errors.Wrap(err, "failed to create ipfs repo"))
	}

	mrepo := ipfs_mobile.NewRepoMobile(path, repo)
	mnode, err := ipfsutil.NewIPFSMobile(context.Background(), mrepo, &ipfsutil.MobileOptions{})
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
		// DatastoreDir:  weshnet.InMemoryDirectory,
		TinderService: tinderDriver,
		IpfsCoreAPI:   ipfsCoreAPI,
		RootDatastore: ds,
	})
	if err != nil {
		panic(errors.Wrap(err, "failed to create weshnet server"))
	}
	defer svc.Close()

	protocoltypes.RegisterProtocolServiceServer(grpcServer, svc)

	wrappedServer := grpcweb.WrapServer(grpcServer)
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


func electron() {
	 
// Set logger
l := log.New(log.Writer(), log.Prefix(), log.Flags())


// Initialize astilectron
var a, err = astilectron.New(log.New(os.Stderr, "", 0), astilectron.Options{
AppName: "Teritori",
BaseDirectoryPath: "./go/electron/dev/desktop",
AppIconDarwinPath:  "../resources/icon.icns",
AppIconDefaultPath: "../resources/icon.png",
VersionAstilectron: "0.57.0",
VersionElectron: "26.2.4",
})

if err != nil {
	l.Fatal(fmt.Errorf("main: creating astilectron failed: %w", err))
}
defer a.Close()

a.HandleSignals()

// Start
if err = a.Start(); err != nil {
	l.Fatal(fmt.Errorf("main: starting astilectron failed: %w", err))
}


// Create a new window
// New window
var w *astilectron.Window
if w, err = a.NewWindow("http://127.0.0.1:19006", &astilectron.WindowOptions{
	BackgroundColor: astikit.StrPtr("#333"),
	Center: astikit.BoolPtr(true),
	Height: astikit.IntPtr(700),
	Width:  astikit.IntPtr(700),	 
}); err != nil {
	l.Fatal(fmt.Errorf("main: new window failed: %w", err))
}
 

// Create windows
if err = w.Create(); err != nil {
	l.Fatal(fmt.Errorf("main: creating window failed: %w", err))
}

w.NewMenu([]*astilectron.MenuItemOptions{
	{
		Label: astikit.StrPtr("Edit"),
		SubMenu: []*astilectron.MenuItemOptions{
			{
				Label:       astikit.StrPtr("Undo"),
				Role:        astilectron.MenuItemRoleUndo,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+Z"),
			},
			{
				Label:       astikit.StrPtr("Redo"),
				Role:        astilectron.MenuItemRoleRedo,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+Y"),
			},
			{
				Type: astilectron.MenuItemTypeSeparator,
			},
			{
				Label:       astikit.StrPtr("Cut"),
				Role:        astilectron.MenuItemRoleCut,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+X"),
			},
			{
				Label:       astikit.StrPtr("Copy"),
				Role:        astilectron.MenuItemRoleCopy,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+C"),
			},
			{
				Label:       astikit.StrPtr("Paste"),
				Role:        astilectron.MenuItemRolePaste,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+V"),
			},
			{
				Label:       astikit.StrPtr("Select All"),
				Role:        astilectron.MenuItemRoleSelectAll,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+A"),
			},
		},
	},
	{
		Label: astikit.StrPtr("View"),
		SubMenu: []*astilectron.MenuItemOptions{
			{
				Label:       astikit.StrPtr("Reload"),
				Role:        astilectron.MenuItemRoleReload,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+R"),
			},
			{
				Label:       astikit.StrPtr("Full Screen"),
				Role:        astilectron.MenuItemRoleToggleFullScreen,
				Accelerator: astilectron.NewAccelerator("Control+CommandOrControl+F"),
			},
			{
				Type: astilectron.MenuItemTypeSeparator,
			},
			 
		},
	},
	{
		Label: astikit.StrPtr("Window"),
		SubMenu: []*astilectron.MenuItemOptions{
			{
				Label:       astikit.StrPtr("Hide"),
				Role:        astilectron.MenuItemRoleReload,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+H"),
			},
			{
				Label:       astikit.StrPtr("Minimize"),
				Role:        astilectron.MenuItemRoleReload,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+M"),
			},
			{
				Type: astilectron.MenuItemTypeSeparator,
			},
			{
				Label:       astikit.StrPtr("Close"),
				Role:        astilectron.MenuItemRoleReload,
				Accelerator: astilectron.NewAccelerator("CommandOrControl+Q"),
			},
			{
				Label: astikit.StrPtr("Developer Tools"),
				Role:  astilectron.MenuItemRoleToggleDevTools,
			},
		},
	},
 
})

w.OpenDevTools()

w.OnMessage(func(m *astilectron.EventMessage) interface{} {
	// Unmarshal
	var s string
	m.Unmarshal(&s)

	// Process message
	if s == "send-port" {
			return port
	}
	return nil
})

 
 
// Blocking pattern
a.Wait()
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
			// You can add any cleanup operations you need here.
		}
	
		// Start a goroutine to wait for the interrupt signal.
		go func() {
			<-interrupt
			fmt.Println("Received interrupt signal. Cleaning up...")
			cleanup()
			os.Exit(1)
		}()

		
		
	checkFreePort()
	 

	wg.Add(2)
	 
	go electron();
	go wesh();

	wg.Wait();
	
}