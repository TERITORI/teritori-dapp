package indexerdb

import (
	"fmt"
)

func TeritoriCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", "tori", mintContractAddress)
}

func EthereumCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("%s-%s", "eth", mintContractAddress)
}

func TeritoriNFTID(mintContractAddress string, tokenId string) string {
	return fmt.Sprintf("%s-%s-%s", "tori", mintContractAddress, tokenId)
}

func TeritoriUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", "tori", address))
}

func EthereumUserID(address string) UserID {
	return UserID(fmt.Sprintf("%s-%s", "eth", address))
}

func TeritoriActivityID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", "tori", txHash, messageIndex)
}

func EthereumActivityID(txHash string, messageIndex int) string {
	return fmt.Sprintf("%s-%s-%d", "eth", txHash, messageIndex)
}
