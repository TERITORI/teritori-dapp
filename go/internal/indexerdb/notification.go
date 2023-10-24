package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type Notification struct {
	Id        int64           `gorm:"primaryKey"`
	UserId    networks.UserID `gorm:"index"`
	TriggerBy networks.UserID `gorm:"index:unique_triggerBy_body,unique"`
	Body      string          `gorm:"index:unique_triggerBy_body,unique"`
	Category  uint32          `gorm:"index"`
	CreatedAt int64
	Dismissed bool `gorm:"default:false"`
}
