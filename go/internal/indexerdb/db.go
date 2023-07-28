package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type App struct {
	ID            uint
	Height        int64
	ChunkedHeight int64
	TxHash        string
}

type User struct {
	ID networks.UserID
}

var allModels = []interface{}{
	// app
	&App{},

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
	&Burn{},
	&SendNFT{},
	&TransferNFT{},

	// quests
	&Quest{},
	&QuestCompletion{},

	// p2e
	&P2eSquadStaking{},
	&P2eLeaderboard{},

	// feed
	&Post{},

	// orgs
	&DAO{},
	&DAOMember{},
	&DAOProposal{},

	// names
	&Name{},

	// music/video
	&Video{},
	&VideoLibrary{},
	&VideoViewCount{},
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
