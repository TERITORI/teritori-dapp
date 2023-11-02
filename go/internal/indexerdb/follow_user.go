package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type FollowUser struct {
	Id           int64           `gorm:"primaryKey"`
	UserId       networks.UserID `gorm:"index"`
	FollowUserId networks.UserID `gorm:"index:unique_triggerBy_body,unique"`
}
