// package main

// import (
// 	"context"

// 	// remoteClient "github.com/ipfs/boxo/pinning/remote/client"
// )

// func main() {
// 	url := "https://nft.storage"
// 	bearerToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDljQzdjNTI2QUMyOGQ0MDZFOTk3Zjg5RjVEODY1NDkzYzQyZjhFMzYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMzg1NTY3Mjc4NiwibmFtZSI6InBpbm5pbmcifQ.yGO_AZl91Ail71u0AdNoXE7G9NmEnxQ_vjq8uh4Pxn0"

// 	client := remoteClient.NewClient(url, bearerToken)
// 	ctx := context.Background()

// 	chan_data, chan_err := client.Ls(ctx)

// 	data, err := <-chan_data, <-chan_err
// }