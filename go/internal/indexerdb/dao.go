package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"gorm.io/datatypes"
)

type Dao struct {
	NetworkID               string `gorm:"primaryKey"`
	ContractAddress         string `gorm:"primaryKey"`
	Admin                   string
	Name                    string
	Description             string
	ImageUrl                string
	AutomaticallyAddCw20s   bool
	AutomaticallyAddCw721s  bool
	Quorum                  string
	Threshold               string
	TokenName               string
	TokenSymbol             string
	UnstakingDuration       uint
	PreProposeModuleAddress string `gorm:"index"`
	GroupContractAddress    string `gorm:"index"`
	ProposalModuleAddress   string `gorm:"index"`
	Members                 []*DaoMember
	Proposals               []*DaoProposal
}

type DaoMember struct {
	DaoNetworkID       string `gorm:"primaryKey"`
	DaoContractAddress string `gorm:"primaryKey"`
	MemberAddress      string `gorm:"primaryKey"`
}

type DaoProposal struct {
	DaoNetworkID       string `gorm:"primaryKey"`
	DaoContractAddress string `gorm:"primaryKey"`
	ProposalID         uint64 `gorm:"primaryKey;autoIncrement:false"`
	Title              string
	Description        string
	ProposerID         networks.UserID
	Msgs               datatypes.JSON
}
