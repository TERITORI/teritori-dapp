package indexerdb

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type ArrayJSONB []interface{}           // TODO: use datatypes.JSON
type ObjectJSONB map[string]interface{} // TODO: use datatypes.JSON

func (p ArrayJSONB) Value() (driver.Value, error) {
	j, err := json.Marshal(p)
	return j, err
}

func (p *ArrayJSONB) Scan(src interface{}) error {
	source, ok := src.([]byte)
	if !ok {
		return errors.New("type assertion .([]byte) failed")
	}

	var i interface{}
	err := json.Unmarshal(source, &i)
	if err != nil {
		return err
	}

	*p, ok = i.([]interface{})
	if !ok {
		return errors.New("type assertion failed")
	}

	return nil
}

func (j ObjectJSONB) Value() (driver.Value, error) {
	valueString, err := json.Marshal(j)
	return string(valueString), err
}

func (j *ObjectJSONB) Scan(value interface{}) error {
	if err := json.Unmarshal(value.([]byte), &j); err != nil {
		return err
	}
	return nil
}
