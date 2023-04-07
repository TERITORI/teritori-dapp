package prices_db

import (
	"database/sql"
	"time"
)

func PriceUpsert(db *sql.DB, date time.Time, coinId string, usdPrice float64) error {
	_, err := db.Exec(`
    INSERT INTO prices(timestamp, currency, usd) 
    VALUES($1, $2, $3)
    ON CONFLICT ON CONSTRAINT prices_pkey DO UPDATE
    SET usd = EXCLUDED.usd
  `, date, coinId, usdPrice)
	return err
}
