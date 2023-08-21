package indexerdb

type Name struct {
	Value     string `gorm:"primaryKey"`
	UserID    string
	NetworkID string
}
