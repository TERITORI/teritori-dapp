package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type User struct {
	ID networks.UserID

	NetworkID string `gorm:"index"`
}

var allModels = []interface{}{
	// users
	&User{},

	// launchpad
	&LaunchpadProject{},
	&LaunchpadToken{},
	&LaunchpadWhitelist{},
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
