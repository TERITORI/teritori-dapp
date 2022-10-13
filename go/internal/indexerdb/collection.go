package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/marketplacepb"

type Collection struct {
	// ID is network-dependent
	// Teritori: tori-<bech32_mint_contract_address>
	ID string `gorm:"primaryKey"`

	Network  marketplacepb.Network
	Name     string
	ImageURI string

	// "has one" relations
	TeritoriCollection *TeritoriCollection

	// "has many" relations
	NFTs []*NFT
}

type TeritoriCollection struct {
	CollectionID        string
	MintContractAddress string `gorm:"primaryKey"`
	NFTContractAddress  string
}
