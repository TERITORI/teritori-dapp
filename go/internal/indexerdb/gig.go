package indexerdb

type Gig struct {
  Id uint32 `gorm:"primaryKey;autoIncrement"`
  Address string
  Data string
}
