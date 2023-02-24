package indexerdb

type Report struct {
	ID     string `gorm:"primaryKey"`
	Desc   string
	RefUrl string
}
