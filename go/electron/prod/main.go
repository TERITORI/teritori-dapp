package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"time"

	mrand "math/rand"

	"github.com/dgraph-io/badger/options"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/phayes/freeport"
	"moul.io/srand"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"github.com/peterbourgon/ff/v3"
	"go.uber.org/zap"
	"google.golang.org/grpc"

	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	bootstrap "github.com/asticode/go-astilectron-bootstrap"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pkg/errors"
)

// Constants
const htmlAbout = `Welcome on <b>Astilectron</b> demo!<br>
This is using the bootstrap and the bundler.`

// Vars injected via ldflags by bundler
var (
	AppName            string
	BuiltAt            string
	VersionAstilectron string
	VersionElectron    string
)

// Application Vars

var (
	fs           = flag.NewFlagSet(os.Args[0], flag.ContinueOnError)
	debug        = fs.Bool("d", false, "enables the debug mode")
	port         = 0
	weshDir      = ""
	w            *astilectron.Window
	ds           *badger.Datastore
	tinderDriver *tinder.Service
	mnode        *ipfs_mobile.IpfsMobile
	mrepo        *ipfs_mobile.RepoMobile
	localdisc    *tinder.LocalDiscovery
	ipfsCoreAPI  ipfsutil.ExtendedCoreAPI
)

func checkFreePort() {
	firstPort, err := freeport.GetFreePort()
	if err == nil {
		port = firstPort
	}

}

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
	newDirName := "wesh-electron"
	ex, err := os.Executable() // ex is the path to where the app is being executed
	if err == nil {

	// Create the full path for the new directory
	weshDir = filepath.Join(filepath.Dir(ex), newDirName)

	// Check if the directory already exists
	_, err = os.Stat(weshDir)
	if err == nil {
		fmt.Printf("Directory '%s' already exists.\n", weshDir)

	} else {
		// Create the new directory
		err = os.Mkdir(weshDir, 0755)
		if err != nil {
			fmt.Println("Error:", err)
			return
		}

		fmt.Printf("Created directory '%s'.\n", weshDir)
	}
}
}

func wesh() {
	checkAndCreateDir()

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

func startListeners() {
	w.On(astilectron.EventNameAppCmdQuit, func(e astilectron.Event) (deleteListener bool) {
		handleExit()
		return
	})
	w.On(astilectron.EventNameAppCmdStop, func(e astilectron.Event) (deleteListener bool) {
		handleExit()
		return
	})
	w.On(astilectron.EventNameAppCrash, func(e astilectron.Event) (deleteListener bool) {
		handleExit()
		return
	})
}

func electron() {

	// Create logger
	l := log.New(log.Writer(), log.Prefix(), log.Flags())
	// Parse flags
	fs.Parse(os.Args[1:])

	// Run bootstrap
	l.Printf("Running app built at %s\n", BuiltAt)

	defer func() {
		handleExit()
	}()

	if err := bootstrap.Run(bootstrap.Options{
		Asset:    Asset,
		AssetDir: AssetDir,
		AstilectronOptions: astilectron.Options{
			AppName:            AppName,
			AppIconDarwinPath:  "./resources/icon.icns",
			AppIconDefaultPath: "./resources/icon.png",
			SingleInstance:     true,
			VersionAstilectron: VersionAstilectron,
			VersionElectron:    VersionElectron,
		},
		Debug:  *debug,
		Logger: l,
		MenuOptions: []*astilectron.MenuItemOptions{{
			Label: astikit.StrPtr("File"),
			SubMenu: []*astilectron.MenuItemOptions{
				{
					Accelerator: astilectron.NewAccelerator("Alt", "CommandOrControl", "I"),
					Role:        astilectron.MenuItemRoleToggleDevTools,
				},

				{Type: astilectron.MenuItemTypeSeparator},
				{
					Label: astikit.StrPtr(fmt.Sprintf("Quit %s", AppName)),
					Role:  astilectron.MenuItemRoleQuit,
				},
			},
		},
			{
				Label: astikit.StrPtr("Edit"),
				SubMenu: []*astilectron.MenuItemOptions{
					{
						Label:       astikit.StrPtr("Undo"),
						Accelerator: astilectron.NewAccelerator("CmdOrCtrl", "Z"),
						Role:        astikit.StrPtr("undo:"),
					},
					{
						Label:       astikit.StrPtr("Redo"),
						Accelerator: astilectron.NewAccelerator("Shift", "CmdOrCtrl", "Z"),
						Role:        astikit.StrPtr("redo"),
					},
					{
						Type: astikit.StrPtr("separator"),
					},
					{
						Label:       astikit.StrPtr("Cut"),
						Accelerator: astilectron.NewAccelerator("CmdOrCtrl", "X"),
						Role:        astikit.StrPtr("cut"),
					},
					{
						Label:       astikit.StrPtr("Copy"),
						Accelerator: astilectron.NewAccelerator("CmdOrCtrl", "C"),
						Role:        astikit.StrPtr("copy"),
					},
					{
						Label:       astikit.StrPtr("Paste"),
						Accelerator: astilectron.NewAccelerator("CmdOrCtrl", "V"),
						Role:        astikit.StrPtr("paste"),
					},
					{
						Label:       astikit.StrPtr("Select All"),
						Accelerator: astilectron.NewAccelerator("CmdOrCtrl", "A"),
						Role:        astikit.StrPtr("selectAll"),
					},
				},
			},
			{
				Label: astikit.StrPtr("View"),
				SubMenu: []*astilectron.MenuItemOptions{
					{
						Label: astikit.StrPtr("Reload"),
						OnClick: func(e astilectron.Event) (deleteListener bool) {
							w.Restore()
							return
						},
					},
					{
						Label: astikit.StrPtr("Force Reload"),
						Role:  astilectron.MenuItemRoleForceReload,
					},
					{
						Label:       astikit.StrPtr("Full Screen"),
						Role:        astilectron.MenuItemRoleToggleFullScreen,
						Accelerator: astilectron.NewAccelerator("Control+CommandOrControl+F"),
					},
					{
						Label: astikit.StrPtr("Developer Tools"),
						Role:  astilectron.MenuItemRoleToggleDevTools,
					},
				},
			},
		},
		OnWait: func(_ *astilectron.Astilectron, ws []*astilectron.Window, _ *astilectron.Menu, _ *astilectron.Tray, _ *astilectron.Menu) error {
			w = ws[0]

			go func() {
				time.Sleep(5 * time.Second)
				if err := bootstrap.SendMessage(w, "check.out.menu", "Don't forget to check out the menu!"); err != nil {
					l.Println(fmt.Errorf("sending check.out.menu event failed: %w", err))
				}
				bootstrap.SendMessage(w, "weshnet.port", port)

			}()
			 
			return nil
		},

		RestoreAssets: RestoreAssets,
		Windows: []*bootstrap.Window{{
			Homepage:       "index.html",
			MessageHandler: handleMessages,
			Options: &astilectron.WindowOptions{
				BackgroundColor: astikit.StrPtr("#333"),
				Center:          astikit.BoolPtr(true),
				Height:          astikit.IntPtr(700),
				Width:           astikit.IntPtr(700),
				WebPreferences: &astilectron.WebPreferences{
					EnableRemoteModule: astikit.BoolPtr(true),
				},
			},
		}},
	}); err != nil {
		l.Fatal(fmt.Errorf("running bootstrap failed: %w", err))
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

	checkFreePort()

	wg.Add(2)
	go electron()
	go wesh()
	wg.Wait()

}
