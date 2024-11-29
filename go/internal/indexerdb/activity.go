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
	ActivityKindRequestMint    = ActivityKind("request-mint")
	ActivityKindMint           = ActivityKind("mint")
	ActivityKindBurn           = ActivityKind("burn")
	ActivityKindSendNFT        = ActivityKind("send-nft")
	ActivityKindTransferNFT    = ActivityKind("transfer-nft")
	ActivityKindUpdateNFTPrice = ActivityKind("update-nft-price")
)

type Activity struct {
	// ID is network-dependent
	// Teritori: tori-<tx_hash>-<msg_index>[-<activity_index>]
	ID           networks.ActivityID
	Kind         ActivityKind    `gorm:"index"`
	Time         time.Time       `gorm:"index"`
	NetworkID    string          `gorm:"index"`
	NFTID        *networks.NFTID `gorm:"index"`
	NFT          *NFT
	CollectionID *networks.CollectionID `gorm:"index"`
	Collection   *Collection

	// "has one" relations
	Listing        *Listing
	CancelListing  *CancelListing
	Trade          *Trade
	Mint           *Mint
	Burn           *Burn
	SendNFT        *SendNFT
	TransferNFT    *TransferNFT
	UpdateNFTPrice *UpdateNFTPrice
	RequestMint    *RequestMint
}

type Listing struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	SellerID   networks.UserID

	NetworkID string `gorm:"index"`
}

type CancelListing struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	SellerID   networks.UserID

	NetworkID string `gorm:"index"`
}

type UpdateNFTPrice struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	SellerID   networks.UserID
	Price      string
	PriceDenom string
	USDPrice   float64

	NetworkID string `gorm:"index"`
}

type Trade struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	BuyerID    networks.UserID
	SellerID   networks.UserID

	NetworkID string `gorm:"index"`
}

type Mint struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Price      string
	PriceDenom string
	USDPrice   float64
	BuyerID    networks.UserID

	NetworkID string `gorm:"index"`
}

type RequestMint struct {
	ActivityID   networks.ActivityID `gorm:"primaryKey"`
	Price        string
	PriceDenom   string
	USDPrice     float64
	CollectionID networks.CollectionID `gorm:"index"`
	BuyerID      networks.UserID       `gorm:"index"`
	Minted       bool                  `gorm:"index"`

	NetworkID string `gorm:"index"`
}

type Burn struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	BurnerID   networks.UserID

	NetworkID string `gorm:"index"`
}

type SendNFT struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Sender     networks.UserID
	Receiver   networks.UserID

	NetworkID string `gorm:"index"`
}

type TransferNFT struct {
	ActivityID networks.ActivityID `gorm:"primaryKey"`
	Sender     networks.UserID
	Receiver   networks.UserID

	NetworkID string `gorm:"index"`
}
