package main

import "gorm.io/datatypes"

type LaunchpadProject struct {
	NetworkID string `gorm:"primaryKey"`
	ProjectID uint32 `gorm:"primaryKey"`

	MerkleRoot     string
	CollectionName string
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
