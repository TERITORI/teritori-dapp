package indexerdb

type Dao struct {
	NetworkID              string `gorm:"primaryKey"`
	Admin                  string
	ContractAddress        string `gorm:"primaryKey"`
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
	Members                []*DaoMember
}

type DaoMember struct {
	DaoNetworkID       string `gorm:"primaryKey"`
	DaoContractAddress string `gorm:"primaryKey"`
	MemberAddress      string `gorm:"primaryKey"`
}

type DaoProposal struct {
	DaoAddress  string
	ProposalId  uint
	Title       string
	Description string
	Proposer    string
	Msgs        string //json
}
