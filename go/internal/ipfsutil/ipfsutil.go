package ipfsutil

import (
	"fmt"
	"strings"
)

// TODO: consider doing this only in front

func IPFSURIToURL(ipfsURI string) string {
	if !strings.HasPrefix(ipfsURI, "ipfs://") {
		return ipfsURI
	}
	return fmt.Sprintf("https://nftstorage.link/ipfs/%s", strings.TrimPrefix(ipfsURI, "ipfs://"))
}
