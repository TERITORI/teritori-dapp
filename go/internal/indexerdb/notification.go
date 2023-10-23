package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/networks"

type Notification struct {
	id        int64           `gorm:"primaryKey"`
	UserId    networks.UserID `gorm:"index"`
	TriggerBy networks.UserID
	Body      string
	Category  uint32 `gorm:"index"`
	CreatedAt int64
	Dismissed bool `gorm:"default:false"`
}
