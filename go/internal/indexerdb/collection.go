package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/networks"

type Collection struct {
	// ID is network-dependent
	// Teritori: <id_prefix>-<bech32_mint_contract_address>
	ID networks.CollectionID `gorm:"primaryKey"`

	NetworkId           string
	Name                string
	ImageURI            string
	MaxSupply           int
	SecondaryDuringMint bool
	Paused              bool

	// "has one" relations
	TeritoriCollection *TeritoriCollection

	// "has many" relations
	NFTs []*NFT
}

type TeritoriCollection struct {
	CollectionID        networks.CollectionID `gorm:"index"`
	MintContractAddress string                `gorm:"primaryKey"`
	NFTContractAddress  string
	CreatorAddress      string
}
