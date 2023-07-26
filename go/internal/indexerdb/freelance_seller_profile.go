package indexerdb

import "time"

type FreelanceSellerProfile struct {
	SellerId      uint64 `gorm:"primaryKey;autoIncrement"`
	SellerAddress string
	Ipfs          string
	Time          time.Time
	IsActive      bool
}
