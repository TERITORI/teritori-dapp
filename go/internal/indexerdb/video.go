package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type Video struct {
	Identifier string          `gorm:"primaryKey"`
	Metadata   ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	CreatedBy  networks.UserID `gorm:"index"`
	CreatedAt  int64
	ViewCount  int64
	LastView   int64
	IsDeleted  bool
}
type VideoViewCount struct {
	Identifier string `gorm:"primaryKey"`
	ViewUser   string `gorm:"primaryKey"`
}

type VideoLibrary struct {
	Owner      networks.UserID `gorm:"primaryKey"`
	Identifier string          `gorm:"PrimaryKey"`
}
