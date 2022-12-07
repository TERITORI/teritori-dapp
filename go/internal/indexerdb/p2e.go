package indexerdb

import "github.com/lib/pq"

// Delete the record when user unstake
type P2eSquadStaking struct {
	ID uint `gorm:"primaryKey"`

	OwnerID      UserID         `gorm:"uniqueIndex: unique_staking"`
	StartTime    uint64         `gorm:"uniqueIndex: unique_staking"`
	EndTime      uint64         `gorm:"index"`
	CollectionID string         `gorm:"index"`
	TokenIDs     pq.StringArray `gorm:"type:varchar(8)[]"`
}

// For the global leaderboard in the future
// we can use a specific ContractAddress: Ex: global
// and aggregate all data in that
type P2eLeaderboard struct {
	ID uint `gorm:"primaryKey"`

	UserID          UserID `gorm:"index"`
	CollectionID    string `gorm:"index"`
	Score           uint32 `gorm:"index"` // Score already claimed
	InProgressScore uint32 `gorm:"index"` // Score including current staking
	SnapshotScore   uint32 // Historical score used for calculating changes
	SnapshotRank    uint32 // Historical rank used for calculating changes
}
