package indexerdb

import "time"

type Escrow struct {
  Id uint32 `gorm:"primaryKey"`
  Sender string
  Receiver string
  ExpireAt string
  Amount string
  AmountDenom string
  Status uint8
  Time time.Time
}
