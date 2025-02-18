package main

import (
	"context"
	"fmt"

	remoteClient "github.com/ipfs/boxo/pinning/remote/client"
)

func main() {
	// url := "https://nft.storage"
	url := "https://api.pinata.cloud/psa"
	// bearerToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDljQzdjNTI2QUMyOGQ0MDZFOTk3Zjg5RjVEODY1NDkzYzQyZjhFMzYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMzg1NTY3Mjc4NiwibmFtZSI6InBpbm5pbmcifQ.yGO_AZl91Ail71u0AdNoXE7G9NmEnxQ_vjq8uh4Pxn0"
	bearerToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMjJlZjcyOC0xMGJjLTQ2ZmMtYjI1NC02M2Y2MWM0N2YyZjAiLCJlbWFpbCI6InRyb25naGlldS5oYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTgwNDY2ZTA5YjE0ZjBiODg1M2YiLCJzY29wZWRLZXlTZWNyZXQiOiI1NGEwMzRiNzJiMzk0NzM2MzQ1NTZlY2I5OGQzNmI4Y2Q2NmM2ZTM2MWNhM2I4MDVhZTMyZGJlYTQwZTRlZDY1IiwiaWF0IjoxNzEzODYzMzc5fQ.tuSSi9dSjSO2IOTlNsU6kgWxSMIG5N6mlYzC3VuSkTA"

	client := remoteClient.NewClient(url, bearerToken)
	ctx := context.Background()

	data, err := client.LsSync(ctx)

	// myCid, err := cid.Decode("Qmf9eHWdSY3v2cwm4ckTcVj59pXV7QSiU6zfeUwXnNx1Me")
	// fmt.Println("myCid:", myCid, " - err:", err)

	// status, err := client.Add(ctx, myCid)
	// fmt.Println("status:", status, " - err:", err)

	fmt.Println(err)
	fmt.Println(data)
}
