package ipfsutil

import (
	"fmt"
	"strings"
)

func IPFSURIToURL(ipfsURI string) string {
	if !strings.HasPrefix(ipfsURI, "ipfs://") {
		return ipfsURI
	}
	// TODO: validate uri
	return fmt.Sprintf("https://nftstorage.link/ipfs/%s", strings.TrimPrefix(ipfsURI, "ipfs://"))
}
