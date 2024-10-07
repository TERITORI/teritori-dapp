package ipfsutil

import (
	"fmt"
	"strings"
)

// TODO: consider doing this only in front

const GatewayBase = "w3s.link"

func IPFSURIToURL(ipfsURI string) string {
	if !strings.HasPrefix(ipfsURI, "ipfs://") {
		return ipfsURI
	}
	return fmt.Sprintf("https://"+GatewayBase+"/ipfs/%s", strings.TrimPrefix(ipfsURI, "ipfs://"))
}
