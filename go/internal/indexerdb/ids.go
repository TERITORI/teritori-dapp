package indexerdb

import (
	"fmt"

	"github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"
)

func TeritoriCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", marketplacepb.Network_NETWORK_TERITORI.Prefix(), mintContractAddress)
}

func TeritoriNFTID(mintContractAddress string, tokenId string) string {
	return fmt.Sprintf("%s-%s-%s", marketplacepb.Network_NETWORK_TERITORI.Prefix(), mintContractAddress, tokenId)
}

func TeritoriUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", marketplacepb.Network_NETWORK_TERITORI.Prefix(), address))
}

func TeritoriActiviyID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", marketplacepb.Network_NETWORK_TERITORI.Prefix(), txHash, messageIndex)
}
