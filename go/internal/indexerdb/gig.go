package indexerdb

import "time"

type Gig struct {
  Id uint32 `gorm:"primaryKey"`
  Address string
  GigData string
  Time time.Time
  Status uint8
}
