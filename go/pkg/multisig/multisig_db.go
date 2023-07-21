package multisig

import (
	"time"
)

type Token struct {
	UserAddress string `gorm:"primaryKey"`
	Nonce       string `gorm:"uniqueIndex"`
	CreatedAt   time.Time
	Duration    time.Duration
}

type UserMultisig struct {
	ChainID         string    `gorm:"primaryKey"`
	UserAddress     string    `gorm:"primaryKey"`
	MultisigAddress string    `gorm:"primaryKey"`
	CreatedAt       time.Time `gorm:"index"`
	UpdatedAt       time.Time
	Joined          bool `gorm:"index"`
	Name            string
}

type Multisig struct {
	ChainID    string `gorm:"primaryKey"`
	Address    string `gorm:"primaryKey"`
	CreatedAt  time.Time
	PubKeyJSON string
}

type Transaction struct {
	ChainID         string    `gorm:"primaryKey"`
	MultisigAddress string    `gorm:"primaryKey"`
	AccountNumber   uint32    `gorm:"primaryKey"`
	Sequence        uint32    `gorm:"primaryKey"`
	MsgsJSON        string    `gorm:"primaryKey"`
	FeeJSON         string    `gorm:"primaryKey"`
	FinalHash       *string   `gorm:"uniqueIndex"`
	CreatedAt       time.Time `gorm:"index"`
	UpdatedAt       time.Time
	CreatorAddress  string
}
