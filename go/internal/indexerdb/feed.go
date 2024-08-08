package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"gorm.io/datatypes"
)

type Post struct {
	Identifier           string          `gorm:"primaryKey"`
	ParentPostIdentifier string          `gorm:"index"`
	Category             uint32          `gorm:"index"`
	IsBot                bool            `gorm:"default:false"`
	Metadata             datatypes.JSON  `gorm:"type:jsonb;default:'{}'"`
	UserReactions        datatypes.JSON  `gorm:"type:jsonb;default:'{}'"`
	AuthorId             networks.UserID `gorm:"index"`
	PremiumLevel         uint32          `gorm:"index"`
	Lat                  float64         `gorm:"type:double precision"`
	Lng                  float64         `gorm:"type:double precision"`
	LatInt               int             `gorm:"index"`
	LngInt               int             `gorm:"index"`
	CreatedAt            int64
	IsDeleted            bool
	IsFree               bool
	TipAmount            int64

	NetworkID string `gorm:"index"`
}
