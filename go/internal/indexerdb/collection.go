package indexerdb

type Collection struct {
	// ID is network-dependent
	// Teritori: tori-<bech32_mint_contract_address>
	ID string `gorm:"primaryKey"`

	NetworkId           string
	Name                string
	ImageURI            string
	MaxSupply           int
	SecondaryDuringMint bool

	// "has one" relations
	TeritoriCollection *TeritoriCollection

	// "has many" relations
	NFTs []*NFT
}

type TeritoriCollection struct {
	CollectionID        string `gorm:"index"`
	MintContractAddress string `gorm:"primaryKey"`
	NFTContractAddress  string
	CreatorAddress      string
}
