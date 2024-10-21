package main

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/launchpadpb"
	"gorm.io/datatypes"
)

type LaunchpadProject struct {
	NetworkID string `gorm:"primaryKey"`
	ProjectID uint32 `gorm:"primaryKey"`

	Status     launchpadpb.Status
	ProposalId string
}

type LaunchpadToken struct {
	NetworkID string `gorm:"primaryKey"`
	ProjectID uint32 `gorm:"primaryKey"`
	TokenID   uint32 `gorm:"primaryKey"`

	Metadata datatypes.JSON
}

type LaunchpadWhitelist struct {
	NetworkID   string `gorm:"primaryKey"`
	ProjectID   uint32 `gorm:"primaryKey"`
	WhitelistID uint32 `gorm:"primaryKey"`

	MerkleRoot string
	Data       datatypes.JSON
}
