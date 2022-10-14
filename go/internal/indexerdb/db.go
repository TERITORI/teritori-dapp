package indexerdb

import (
	"github.com/pkg/errors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// UserID is network-dependent
// Teritori: tori-<bech32_address>
type UserID string

type App struct {
	ID     uint
	Height int64
}

var allModels = []interface{}{
	// app
	&App{},

	// collections
	&Collection{},
	&TeritoriCollection{},

	// nfts
	&NFT{},
	&TeritoriNFT{},

	// activity
	&Activity{},
	&Listing{},
	&Trade{},

	// quests
	&Quest{},
	&QuestCompletion{},
}

func NewSQLiteDB(path string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(path))
	if err != nil {
		return nil, errors.Wrap(err, "open db")
	}
	if err := db.AutoMigrate(allModels...); err != nil {
		return nil, errors.Wrap(err, "migrate db")
	}
	return db, nil
}
