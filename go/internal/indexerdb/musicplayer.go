package indexerdb

import "time"

type MusicAlbum struct {
	ID uint32 `gorm:"primaryKey;autoIncrement"`
	Name string
	Description string
	Image string //ipfs url
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type MusicFile struct {
	AlbumId uint32 `gorm:"primaryKey"`
	FileId uint32 `gorm:"primaryKey"`	
	Name string
	Duration uint32 //seconds
	Ipfs string //ipfs hash
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}