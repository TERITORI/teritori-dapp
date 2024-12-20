package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"gorm.io/datatypes"
)

type LaunchpadProject struct {
	NetworkID string          `gorm:"primaryKey"`
	ProjectID string          `gorm:"primaryKey"`
	CreatorID networks.UserID `gorm:"index"`

	Status     launchpadpb.Status
	ProposalId string

	CollectionData datatypes.JSON
}

type LaunchpadToken struct {
	NetworkID string `gorm:"primaryKey"`
	ProjectID string `gorm:"primaryKey"`
	TokenID   uint32 `gorm:"primaryKey"`

	Metadata datatypes.JSON
}
