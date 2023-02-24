package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

/*
userReactions = [
	{icon: [userId, ...]}
]
*/

type Post struct {
	Identifier           string `gorm:"primaryKey"`
	ParentPostIdentifier string `gorm:"index"`
	Category             uint32 `gorm:"index"`
	IsDeleted            bool
	IsFree               bool
	Metadata             ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	UserReactions        ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	CreatedBy            networks.UserID `gorm:"index"`
	CreatedAt            int64
}
