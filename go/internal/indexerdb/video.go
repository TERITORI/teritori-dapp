package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
)

type Video struct {
	Identifier string          `gorm:"primaryKey"`
	Metadata   ObjectJSONB     `gorm:"type:jsonb;default:'{}'"`
	CreatedBy  networks.UserID `gorm:"index"`
	CreatedAt  int64
	LastView   int64
	IsDeleted  bool
	ViewCount  int64 `gorm:"default:0"`
	Like       int64 `gorm:"default:0"`
	Dislike    int64 `gorm:"default:0"`
	IsDeleted  bool  `gorm:"default:false"`
}
type VideoViewCount struct {
	Identifier string `gorm:"primaryKey"`
	ViewUser   string `gorm:"primaryKey"`
}

type VideoLibrary struct {
	Owner      networks.UserID `gorm:"primaryKey"`
	Identifier string          `gorm:"PrimaryKey"`
}

type VideoLike struct {
	Identifier string `gorm:"primaryKey"`
	User       string `gorm:"primaryKey"`
}

type VideoDislike struct {
	Identifier string `gorm:"primaryKey"`
	User       string `gorm:"primaryKey"`
}

type VideoComment struct {
	Identifier      string `gorm:"primaryKey"`
	VideoIdentifier string
	Comment         string
	CreatedAt       int64
	CreatedBy       networks.UserID `gorm:"index"`
	IsDeleted       bool            `gorm:"default:false"`
}
