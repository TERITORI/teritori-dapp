package indexerdb

import "time"

type FreelanceEscrow struct {
	Id          uint32 `gorm:"primaryKey"`
	Sender      string
	Receiver    string
	ExpireAt    uint64
	Amount      string
	AmountDenom string
	Status      uint8
	Time        time.Time
}
