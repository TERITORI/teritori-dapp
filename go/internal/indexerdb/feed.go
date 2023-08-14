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
	Identifier           string          `gorm:"primaryKey"`
	ParentPostIdentifier string          `gorm:"index"`
	Category             uint32          `gorm:"index"`
	IsBot                bool            `gorm:"default:false"`
	Metadata             ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	UserReactions        ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	AuthorId             networks.UserID `gorm:"index"`
	CreatedAt            int64
	IsDeleted            bool
	IsFree               bool
	TipAmount            int64
}
