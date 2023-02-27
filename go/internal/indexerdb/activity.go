package indexerdb

import (
	"time"

	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

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
	ID   networks.ActivityID
	Kind ActivityKind `gorm:"index"`
	Time time.Time    `gorm:"index"`

	// "has one" relations
	Listing        *Listing
	CancelListing  *CancelListing
	Trade          *Trade
	Mint           *Mint
	Burn           *Burn
	SendNFT        *SendNFT
	TransferNFT    *TransferNFT
	UpdateNFTPrice *UpdateNFTPrice

	// "belongs to" relations
	NFTID networks.NFTID `gorm:"index"`
	NFT   *NFT
}

type Listing struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	SellerID   networks.UserID
}

type CancelListing struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	SellerID   networks.UserID
}

type UpdateNFTPrice struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	SellerID   networks.UserID
	Price      string
	PriceDenom string
	USDPrice   float64
}

type Trade struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	BuyerID    networks.UserID
	SellerID   networks.UserID
}

type Mint struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	BuyerID    networks.UserID
}

type Burn struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	BurnerID   networks.UserID
}

type SendNFT struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Sender     networks.UserID
	Receiver   networks.UserID
}

type TransferNFT struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Sender     networks.UserID
	Receiver   networks.UserID
}
