package indexerdb

import "fmt"

func TeritoriCollectionID(mintContractAddress string) string {
	return fmt.Sprintf("tori-%s", mintContractAddress)
}

func TeritoriNFTID(mintContractAddress string, tokenId string) string {
	return fmt.Sprintf("tori-%s-%s", mintContractAddress, tokenId)
}

func TeritoriUserID(address string) UserID {
	return UserID(fmt.Sprintf("tori-%s", address))
}

func TeritoriActiviyID(txhash string) string {
	return fmt.Sprintf("tori-%s", txhash)
}
