package indexerdb

type Report struct {
	ID     int32 `gorm:"primaryKey;autoIncrement"`
	Desc   string
	RefUrl string
}
