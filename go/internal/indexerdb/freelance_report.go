package indexerdb

import "time"

type FreelanceReport struct {
	Id          int32 `gorm:"primaryKey;autoIncrement"`
	Sender      string
	IsSeller    bool
	SellerBuyer string
	ReportData  ObjectJSONB `gorm:"type:jsonb; default:'{}'"`
	Time        time.Time
}
