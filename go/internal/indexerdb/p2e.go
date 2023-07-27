package indexerdb

import "github.com/TERITORI/teritori-dapp/go/pkg/networks"

// Delete the record when user unstake
type P2eSquadStaking struct {
	OwnerID   networks.UserID `gorm:"primaryKey"`
	StartTime uint64          `gorm:"primaryKey"`
	TokenIDs  string          `gorm:"primaryKey"`
	SeasonID  string          `gorm:"index"`
	EndTime   uint64          `gorm:"index"`
	NetworkID string          `gorm:"index"`
}

// For the global leaderboard in the future
// we can use a specific ContractAddress: Ex: global
// and aggregate all data in that
type P2eLeaderboard struct {
	UserID          networks.UserID `gorm:"primaryKey"`
	SeasonID        string          `gorm:"primaryKey"`
	Rank            uint32          `gorm:"index;"`
	Score           uint32          `gorm:"index"` // Score already claimed
	InProgressScore uint32          `gorm:"index"` // Score including current staking
	SnapshotScore   uint32          // Historical score used for calculating changes
	SnapshotRank    uint32          // Historical rank used for calculating changes
	NetworkID       string          `gorm:"index"`
}

type P2eDailyReward struct {
	DayID        string      `gorm:"primaryKey"` // Format yyyy-mm-dd
	NetworkID    string      `gorm:"primaryKey"`
	DailyRewards ObjectJSONB `gorm:"type:jsonb;default:'{}'"`
	TotalRewards ObjectJSONB `gorm:"type:jsonb;default:'{}'"`
	MerkleRoot   string      `gorm:"merkleRoot"`
}

type P2eTotalClaimed struct {
	UserID    networks.UserID `gorm:"primaryKey"`
	NetworkID string          `gorm:"primaryKey"`
	Amount    string
}
