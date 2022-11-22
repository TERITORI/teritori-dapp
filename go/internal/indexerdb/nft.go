package indexerdb

import (
	"database/sql"
)

type NFT struct {
	// ID is network-dependent
	// Teritori: tori-<bech32_mint_contract_address>-<token_id>
	ID          string
	Name        string
	ImageURI    string
	OwnerID     UserID
	IsListed    bool
	PriceAmount sql.NullString `gorm:"type:numeric"`
	PriceDenom  string

	// "belongs to" relations
	CollectionID string `gorm:"index"`
	Collection   *Collection

	// "has one" relations
	TeritoriNFT *TeritoriNFT

	// "has many" relations
	Activities []Activity
	Burnt      bool
}

type TeritoriNFT struct {
	NFTID   string `gorm:"primaryKey"`
	TokenID string
}
