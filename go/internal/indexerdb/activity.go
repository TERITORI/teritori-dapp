package indexerdb

import "time"

type ActivityKind string

const (
	ActivityKindUnknown       = ActivityKind("")
	ActivityKindTrade         = ActivityKind("trade")
	ActivityKindList          = ActivityKind("list")
	ActivityKindCancelListing = ActivityKind("cancel_listing")
)

type Activity struct {
	// ID is network-dependent
	// Teritori: tori-<tx_hash>
	ID   string
	Kind ActivityKind
	Time time.Time

	// "has one" relations
	Listing *Listing
	Trade   *Trade

	// "belongs to" relations
	NFTID string
	NFT   *NFT
}

type Listing struct {
	ActivityID string `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	SellerID   UserID
}

type Trade struct {
	ActivityID string `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	BuyerID    UserID
	SellerID   UserID
}
