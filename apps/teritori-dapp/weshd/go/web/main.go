package main

import (
	"strconv"

	"weshd/go/shared"
)

var (
	basePath = "./temp/wesh-dir"
)

func main() {
	port := shared.CheckAndUpdatePortFromArgs()
	path := basePath + "/" + strconv.Itoa(port)
	shared.BootWesh(path)
}
