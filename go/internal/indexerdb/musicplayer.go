package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type MusicAlbum struct {
	Identifier string          `gorm:"primaryKey"`
	Category   uint32          `gorm:"index"`
	Metadata   ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	CreatedBy  networks.UserID `gorm:"index"`
	CreatedAt  int64
	IsDeleted  bool
}

type MusicLibrary struct {
	Owner      networks.UserID `gorm:"primaryKey"`
	Identifier string          `gorm:"PrimaryKey"`
}
