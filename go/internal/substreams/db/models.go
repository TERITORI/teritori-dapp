package db

import (
	"database/sql/driver"
	"encoding/json"
)

type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	valueString, err := json.Marshal(j)
	return string(valueString), err
}

func (j *JSONB) Scan(value interface{}) error {
	if err := json.Unmarshal(value.([]byte), &j); err != nil {
		return err
	}
	return nil
}

type OffchainData struct {
	ID        int64 `gorm:"primaryKey;autoIncrement;notNull"`
	URI       string
	TableName string
	Pk        string
	Network   string
	Data      JSONB `gorm:"type:jsonb;default:'{}'"`
	FieldsMap string
	Error     string
	IsFetched bool `gorm:"default:false"`
}

type Cursors struct {
	ID       string `gorm:"primaryKey;notNull"`
	Cursor   string
	BlockNum uint64
	BlockId  string
	Network  string
}

var AllModels = []interface{}{
	&OffchainData{},
	&Cursors{},
}
