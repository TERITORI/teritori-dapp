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
	"time"

	"berty.tech/weshnet"
	"berty.tech/weshnet/pkg/ipfsutil"
	ipfs_mobile "berty.tech/weshnet/pkg/ipfsutil/mobile"
	"berty.tech/weshnet/pkg/protocoltypes"
	"berty.tech/weshnet/pkg/tinder"
	"github.com/asticode/go-astikit"
	"github.com/asticode/go-astilectron"
	bootstrap "github.com/asticode/go-astilectron-bootstrap"
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

var port = 4254
var path = "./temp/wesh-electron-dev-dir/"

var (
	AppName            = "Teritori"
	BaseDirectoryPath  = "./go/electron/dev/desktop"
	AppIconDarwinPath  = "../resources/icon.icns"
	AppIconDefaultPath = "../resources/icon.png"
	VersionAstilectron = "0.57.0"
	VersionElectron    = "26.2.4"
)

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
		Logger: logger,
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
	l := log.New(log.Writer(), log.Prefix(), log.Flags())

	

	var w *astilectron.Window

	if err := bootstrap.Run(bootstrap.Options{

		AstilectronOptions: astilectron.Options{
			AppName:            AppName,
			BaseDirectoryPath:  BaseDirectoryPath,
			AppIconDarwinPath:  AppIconDarwinPath,
			AppIconDefaultPath: AppIconDefaultPath,
			SingleInstance:     true,
			VersionAstilectron: VersionAstilectron,
			VersionElectron:    VersionElectron,
		},
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

		Windows: []*bootstrap.Window{{
			Homepage: "http://127.0.0.1:19006",
			Options: &astilectron.WindowOptions{
				BackgroundColor: astikit.StrPtr("#333"),
				Center:          astikit.BoolPtr(true),
				Height:          astikit.IntPtr(700),
				Width:           astikit.IntPtr(700),
				WebPreferences: &astilectron.WebPreferences {
					EnableRemoteModule: astikit.BoolPtr(true),
					BackgroundThrottling:  astikit.BoolPtr(true),
				},
				Custom: &astilectron.WindowCustomOptions{Script: `
				const electron = require("electron").remote;	
				console.log("test from customer", electron.app);			
				`},

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
