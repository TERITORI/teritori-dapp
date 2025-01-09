package dao_roles_based

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/seqid"
)

type ProposalStatus int

const (
	ProposalStatusOpen ProposalStatus = iota
	ProposalStatusPassed
	ProposalStatusExecuted
)

func (s ProposalStatus) String() string {
	switch s {
	case ProposalStatusOpen:
		return "Open"
	case ProposalStatusPassed:
		return "Passed"
	case ProposalStatusExecuted:
		return "Executed"
	default:
		return "Unknown"
	}
}

type Votes struct {
	Yes     uint64
	No      uint64
	Abstain uint64
}

type Proposal struct {
	ID          seqid.ID
	Title       string
	Description string
	Proposer    std.Address
	// StartHeight int64
	//MinVotingPeriod dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	//Expiration      dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	// Threshold Threshold: Treshold should be handle in the conditions
	//Message dao_interfaces.ExecutableMessage // copy here the dao_interfaces.ExecutableMessage type from gno/p/dao_interfaces/messages.gno
	Status ProposalStatus
	Votes  Votes
	// AllowRevoting bool not handled in this proposal
	Ballots *avl.Tree // std.Address -> Ballot
}

type ProposalModule struct {
	proposals         *avl.Tree // int -> Proposal
	proposalIDCounter seqid.ID
}

func newProposalModule() *ProposalModule {
	return &ProposalModule{
		proposals: avl.NewTree(),
	}
}

func (p *ProposalModule) newProposal(title, description string, proposer std.Address) {
	id := p.proposalIDCounter.Next()
	proposal := &Proposal{
		ID:          id,
		Title:       title,
		Description: description,
		Proposer:    proposer,
		Status:      ProposalStatusOpen,
		Votes:       Votes{},
		Ballots:     avl.NewTree(),
	}
	p.proposals.Set(id.String(), proposal)
}
