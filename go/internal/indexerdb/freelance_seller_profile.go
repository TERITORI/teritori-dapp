package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type FreelanceSellerProfile struct {
	Seller       networks.UserID `gorm:"primaryKey"`
	MetadataIpfs string
	UpdatedAt    int64
	IsDeleted    bool
	IsActive     bool
}
