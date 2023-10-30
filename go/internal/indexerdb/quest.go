package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/networks"

type Quest struct {
	ID        string `gorm:"primaryKey"`
	NetworkID string `gorm:"primaryKey"`

	Title string
}

type QuestCompletion struct {
	QuestID   string          `gorm:"primaryKey"`
	UserID    networks.UserID `gorm:"primaryKey"`
	NetworkID string          `gorm:"primaryKey"`

	Quest     *Quest
	Completed bool
}
