package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"gorm.io/datatypes"
)

type LaunchpadProject struct {
	NetworkID string          `gorm:"primaryKey"`
	ProjectID string          `gorm:"primaryKey"`
	CreatorID networks.UserID `gorm:"index"`

	MerkleRoot      string
	DeployedAddress string
	CollectionData  datatypes.JSON
}

type LaunchpadToken struct {
	NetworkID string `gorm:"primaryKey"`
	ProjectID string `gorm:"primaryKey"`
	TokenID   uint32 `gorm:"primaryKey"`

	Metadata datatypes.JSON
}

type LaunchpadWhitelist struct {
	NetworkID   string `gorm:"primaryKey"`
	ProjectID   string `gorm:"primaryKey"`
	WhitelistID uint32 `gorm:"primaryKey"`

	MerkleRoot string
	Data       datatypes.JSON
}

