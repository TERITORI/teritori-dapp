package indexerdb

type SellerProfile struct {
	SellerId    string `gorm:"primaryKey"`
	ProfileHash string
}
