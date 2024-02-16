package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type IndexerMode string

const (
	IndexerModeData IndexerMode = "data"
	IndexerModeP2E  IndexerMode = "p2e"
)

type App struct {
	ID            uint
	Height        int64
	ChunkedHeight int64
	TxHash        string
	NetworkID     string
	IndexerMode   IndexerMode
}

// Cursor used by Substreams indexer
type Cursor struct {
	ID          string `gorm:"primaryKey;notNull"`
	Cursor      string
	BlockNum    uint64
	BlockId     string
	Network     string      `gorm:"primaryKey;notNull"`
	IndexerMode IndexerMode `gorm:"primaryKey;notNull"`
}

type User struct {
	ID networks.UserID

	NetworkID string `gorm:"index"`
}

var allModels = []interface{}{
	// app
	&App{},

	// cursor
	&Cursor{},

	// users
	&User{},

	// collections
	&Collection{},
	&TeritoriCollection{},

	// nfts
	&NFT{},
	&TeritoriNFT{},

	// activity
	&Activity{},
	&Listing{},
	&CancelListing{},
	&Trade{},
	&UpdateNFTPrice{},
	&Mint{},
	&RequestMint{},
	&Burn{},
	&SendNFT{},
	&TransferNFT{},

	// quests
	&Quest{},
	&QuestCompletion{},

	// p2e
	&P2eSquadStaking{},
	&P2eLeaderboard{},
	&P2eDailyReward{},
	&P2eTotalClaimed{},

	// feed
	&Post{},

	// orgs
	&DAO{},
	&DAOMember{},
	&DAOProposal{},

	// names
	&Name{},

	// notifications
	&Notification{},
}

func NewSQLiteDB(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path))
	if err != nil {
		return nil, errors.Wrap(err, "open sqlite db")
	}
	return db, nil
}

func NewPostgresDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, errors.Wrap(err, "open postgres db")
	}
	return db, nil
}

func MigrateDB(db *gorm.DB) error {
	return db.AutoMigrate(allModels...)
}
