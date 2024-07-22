package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type Post struct {
	Identifier           string          `gorm:"primaryKey"`
	ParentPostIdentifier string          `gorm:"index"`
	Category             uint32          `gorm:"index"`
	IsBot                bool            `gorm:"default:false"`
	Metadata             ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	UserReactions        ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	AuthorId             networks.UserID `gorm:"index"`
	PremiumLevel         uint32          `gorm:"index"`
	Location             []float32       `gorm:"index"`
	CreatedAt            int64
	IsDeleted            bool
	IsFree               bool
	TipAmount            int64

	NetworkID string `gorm:"index"`
}
