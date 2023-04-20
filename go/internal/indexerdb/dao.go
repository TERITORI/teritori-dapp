package indexerdb

type Dao struct {
	Id                     uint32 `gorm:"primaryKey;autoIncrement"`
	Admin                  string
	Address                string
	Name                   string
	Description            string
	ImageUrl               string
	AutomaticallyAddCw20s  bool
	AutomaticallyAddCw721s bool
	Quorum                 string
	Threshold              string
	TokenName              string
	TokenSymbol            string
	UnstakingDuration      uint
}
