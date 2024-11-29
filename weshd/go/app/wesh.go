package wesh

import (
	"strings"
	"weshd/go/shared"

	globalstore "github.com/sakul-budhathoki/go-store"
)


func SetMultiAddrs(multiAddrs string) {
	globalstore.GetGlobalStore().Set("multiaddr", strings.Split(multiAddrs, ","))
}


func Boot(path string) {
	shared.BootWesh(path)
}

func GetPort() int {
	return shared.CheckAndUpdateFreePort()
}

func Shutdown() {
	shared.Shutdown()
}
