package indexerdb

import (
	"database/sql"

	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type Attribute struct {
	TraitType string `json:"trait_type"`
	Value     string `json:"value"`
}

type AttributeAny struct {
	TraitType string `json:"trait_type"`
	Value     any    `json:"value"`
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
	Attributes  ArrayJSONB `gorm:"type:jsonb;default:'[]'"`
	Burnt       bool
	NetworkID   string `gorm:"index"`

	// "belongs to" relations
	CollectionID networks.CollectionID `gorm:"index"`
	Collection   *Collection

	// "has one" relations
	TeritoriNFT *TeritoriNFT
}

type TeritoriNFT struct {
	NFTID   string `gorm:"primaryKey"`
	TokenID string

	NetworkID string `gorm:"index"`
}
