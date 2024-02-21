package main

import (
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"
	"weshd/go/shared"

	"github.com/mitchellh/go-homedir"
)

func main() {

   shared.CheckAndUpdatePortFromArgs()
	homeDir, err := homedir.Dir()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	dir := "teritori-electron-wesh"

	path := filepath.Join(homeDir, dir)

	// Create a channel to receive the interrupt signal.
	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	// Create a WaitGroup to manage goroutines.
	var wg sync.WaitGroup

	// Function to handle cleanup.
	cleanup := func() {
		fmt.Println("Cleanup code here...")
		shared.Shutdown()
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
	go shared.BootWesh(path)
	wg.Wait()
}
