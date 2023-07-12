package indexerdb

import (
	"github.com/TERITORI/teritori-dapp/go/pkg/networks"
	"gorm.io/datatypes"
)

type DAO struct {
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
	Members                 []*DAOMember
	Proposals               []*DAOProposal
}

type DAOMember struct {
	DAONetworkID       string `gorm:"primaryKey"`
	DAOContractAddress string `gorm:"primaryKey"`
	MemberAddress      string `gorm:"primaryKey"`
}

type DAOProposal struct {
	DAONetworkID       string `gorm:"primaryKey"`
	DAOContractAddress string `gorm:"primaryKey"`
	ProposalID         uint64 `gorm:"primaryKey;autoIncrement:false"`
	Title              string
	Description        string
	ProposerID         networks.UserID
	Msgs               datatypes.JSON
}
