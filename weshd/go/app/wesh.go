package wesh

import (
	"weshd/go/shared"
)

func Boot(path string) {
	shared.BootWesh(path)
}

func GetPort() int {
	return shared.CheckAndUpdateFreePort()
}

func Shutdown() {
	shared.Shutdown()
}
