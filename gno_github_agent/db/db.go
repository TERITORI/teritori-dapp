package db

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func New() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("github.db"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("open sqlite db:%w", err)
	}

	err = db.AutoMigrate(allModels...)
	if err != nil {
		return nil, fmt.Errorf("migrate sqlite db:%w", err)
	}

	return db, nil
}

var allModels = []interface{}{
	&Verification{},
}

type Verification struct {
	gorm.Model
	Id uint `json:"id" gorm:"unique;primaryKey;autoIncrement"`

	Handle    string
	Address   string
	Status    string
	CreatedAt string
}
