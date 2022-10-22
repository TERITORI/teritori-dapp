package indexerdb

import "time"

type ActivityKind string

const (
	ActivityKindUnknown        = ActivityKind("")
	ActivityKindTrade          = ActivityKind("trade")
	ActivityKindList           = ActivityKind("list")
	ActivityKindCancelListing  = ActivityKind("cancel-listing")
	ActivityKindMint           = ActivityKind("mint")
	ActivityKindBurn           = ActivityKind("burn")
	ActivityKindSendNFT        = ActivityKind("send-nft")
	ActivityKindTransferNFT    = ActivityKind("transfer-nft")
	ActivityKindUpdateNFTPrice = ActivityKind("update-nft-price")
)

type Activity struct {
	// ID is network-dependent
	// Teritori: tori-<tx_hash>-<msg_index>
	ID   string
	Kind ActivityKind
	Time time.Time

	// "has one" relations
	Listing        *Listing
	Trade          *Trade
	Mint           *Mint
	Burn           *Burn
	SendNFT        *SendNFT
	TransferNFT    *TransferNFT
	UpdateNFTPrice *UpdateNFTPrice

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

type UpdateNFTPrice struct {
	ActivityID string `gorm:"primaryKey"`
	Price      string
	PriceDenom string
}

type Trade struct {
	ActivityID string `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	BuyerID    UserID
	SellerID   UserID
}

type Mint struct {
	ActivityID string `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	BuyerID    UserID
}

type Burn struct {
	ActivityID string `gorm:"primaryKey"`
	BurnerID   UserID
}

type SendNFT struct {
	ActivityID string `gorm:"primaryKey"`
	Sender     UserID
	Receiver   UserID
}

type TransferNFT struct {
	ActivityID string `gorm:"primaryKey"`
	Sender     UserID
	Receiver   UserID
}
