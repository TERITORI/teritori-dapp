package dao_interfaces

import (
	"std"
)

type ModuleInfo struct {
	Kind    string
	Version string
}

func (mi ModuleInfo) String() string {
	return mi.Kind + "@v" + mi.Version
}

type IVotingModule interface {
	Info() ModuleInfo
	ConfigJSON() string
	GetMembersJSON(start, end string, limit uint64, height int64) string
	Render(path string) string
	VotingPowerAtHeight(address std.Address, height int64, resources []string) (power uint64)
	TotalPowerAtHeight(height int64) uint64
}

type VotingModuleFactory func(core IDAOCore) IVotingModule

type IProposalModule interface {
	Core() IDAOCore
	Info() ModuleInfo
	ConfigJSON() string
	Render(path string) string
	Execute(proposalID int)
	VoteJSON(proposalID int, voteJSON string)
	ProposeJSON(proposalJSON string) int
	ProposalsJSON(limit int, startAfter string, reverse bool) string
	ProposalJSON(proposalID int) string
}

type ProposalModuleFactory func(core IDAOCore) IProposalModule

type IRolesModule interface {
	Info() ModuleInfo
	ConfigJSON() string
	Render(path string) string
	GetMemberRoles(address std.Address) []string
	GetMemberResourceVPower(address std.Address, resource string) uint64
	SetMemberResourceVPower(address std.Address, resource string, power uint64)
	HasRole(address std.Address, role string) bool
	NewRoleJSON(roleName, resourcesJSON string)
	DeleteRole(roleName string)
	GrantRole(address std.Address, role string)
	RevokeRole(address std.Address, role string)
}

type RolesModuleFactory func(core IDAOCore) IRolesModule
