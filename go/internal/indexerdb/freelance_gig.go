package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type FreelanceGig struct {
	Identifier  string          `gorm:"primaryKey"`
	Category    string          `gorm:"index"`
	Subcategory string          `gorm:"index"`
	CreatedBy   networks.UserID `gorm:"index"`
	MetaData    string
	CreatedAt   int64
	IsDeleted   bool
	Status      uint8
}
