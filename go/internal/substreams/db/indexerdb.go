package db

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func MustConnectIndexerDB(dsn string) *gorm.DB {
	parsedDSN, err := parseDSN(dsn)
	if err != nil {
		panic(fmt.Sprintf("failed to parse DSN: %s", err.Error()))
	}

	db, err := gorm.Open(postgres.Open(parsedDSN.connString()), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect to indexer DB: %s", err.Error()))
	}
	return db
}

func MustMigrateDB(db *gorm.DB) {
	if err := db.AutoMigrate(AllModels...); err != nil {
		panic(fmt.Sprintf("failed to migrate DB: %s", err.Error()))
	}
}
