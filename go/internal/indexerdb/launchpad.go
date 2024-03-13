package indexerdb

type LaunchpadProject struct {
	ProjectID uint32 `gorm:"primaryKey"`
	NetworkID string `gorm:"primaryKey"`

	CollectionName string
}

type LaunchpadNftMetadata struct {
	ProjectID uint32 `gorm:"primaryKey"`
	NetworkID string `gorm:"primaryKey"`
	NftIdx    uint32 `gorm:"primaryKey"`

	Metadata ObjectJSONB `gorm:"type:jsonb;default:'{}'"`
}
