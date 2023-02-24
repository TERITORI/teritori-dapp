package indexerdb

import "time"

type Seller struct {
	SellerId      uint64 `gorm:"primaryKey"`
	SellerAddress string
	InfoUrl       string
	Time          time.Time
	IsActive      bool
}
