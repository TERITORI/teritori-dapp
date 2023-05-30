package indexerdb

import (
	"database/sql"
<<<<<<< HEAD
=======

	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
>>>>>>> e393992d3cbfb9d4139af9d0ec74b7d8aba334e5
)

type Attribute struct {
	TraitType string
	Value     string
}

type NFT struct {
	// ID is network-dependent
	// Teritori: tori-<bech32_mint_contract_address>-<token_id>
	ID          networks.NFTID
	Name        string
	ImageURI    string
	OwnerID     networks.UserID
	IsListed    bool
	PriceAmount sql.NullString `gorm:"type:numeric"`
	PriceDenom  string
	LockedOn    string

	// "belongs to" relations
	CollectionID networks.CollectionID `gorm:"index"`
	Collection   *Collection

	// "has one" relations
	TeritoriNFT *TeritoriNFT

	// "has many" relations
	Activities []Activity
	Attributes ArrayJSONB `gorm:"type:jsonb;default:'[]'"`
	Burnt      bool
}

type TeritoriNFT struct {
	NFTID   string `gorm:"primaryKey"`
	TokenID string
}
