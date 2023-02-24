package indexerdb

type SellerProfile struct {
	SellerId    uint64 `gorm:"primaryKey"`
	ProfileHash string
}
