package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type MusicAlbum struct {
	Identifier string          `gorm:"primaryKey"`
	Category   uint32          `gorm:"index"`
	Metadata   ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	CreatedBy  networks.UserID `gorm:"index"`
	CreatedAt  uint64
	IsDeleted  bool
}