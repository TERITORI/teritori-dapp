package dao_interfaces

// Inspired by DA0-DA0: https://github.com/DA0-DA0/dao-contracts

type ActivableProposalModule struct {
	Enabled bool
	Module  IProposalModule
}

type IDAOCore interface {
	Render(path string) string

	VotingModule() IVotingModule
	RolesModule() IRolesModule
	ProposalModules() []ActivableProposalModule
	ActiveProposalModuleCount() int
	Registry() *MessagesRegistry

	UpdateVotingModule(newVotingModule IVotingModule)
	UpdateProposalModules(toAdd []IProposalModule, toDisable []int)

	GetMembersJSON(start, end string, limit uint64, height int64) string
}
