package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/networks"

type Notification struct {
	id        string          `gorm:"primaryKey"`
	UserId    networks.UserID `gorm:"index"`
	Body      string
	Category  uint32 `gorm:"index"`
	CreatedAt int64
	Dismissed bool `gorm:"default:false"`
}
