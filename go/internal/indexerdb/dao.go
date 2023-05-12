package indexerdb

type Dao struct {
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

type DaoProposal struct {
	DaoAddress      string
	ProposalId 		uint
	Title      		string
	Description 	string
	Proposer        string
	Msgs			string 	//json
}