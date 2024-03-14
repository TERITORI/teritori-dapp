package indexerdb

import "gorm.io/datatypes"

type LaunchpadProject struct {
	ProjectID uint32 `gorm:"primaryKey"`
	NetworkID string `gorm:"primaryKey"`

	CollectionName string
}

type LaunchpadNftMetadata struct {
	ProjectID uint32 `gorm:"primaryKey"`
	NetworkID string `gorm:"primaryKey"`
	NftIdx    uint32 `gorm:"primaryKey"`

	Metadata datatypes.JSON
}
