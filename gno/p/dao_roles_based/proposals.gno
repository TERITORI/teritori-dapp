package dao_roles_based

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/seqid"
	"gno.land/p/teritori/daocond"
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

type Proposal struct {
	id          seqid.ID
	title       string
	description string
	proposer    std.Address
	resource    string
	state       daocond.State
	// StartHeight int64
	// MinVotingPeriod dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	// Expiration      dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	// Threshold Threshold: Treshold should be handle in the conditions
	// Message dao_interfaces.ExecutableMessage // copy here the dao_interfaces.ExecutableMessage type from gno/p/dao_interfaces/messages.gno
	Message ExecutableMessage
	status  ProposalStatus
	// AllowRevoting bool not handled in this proposal
	votes map[string]daocond.Vote
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

func (p *ProposalModule) newProposal(title, description string, proposer std.Address, state daocond.State) {
	id := p.proposalIDCounter.Next()
	proposal := &Proposal{
		id:          id,
		title:       title,
		description: description,
		proposer:    proposer,
		status:      ProposalStatusOpen,
		state:       state,
		votes:       map[string]daocond.Vote{},
	}
	p.proposals.Set(id.String(), proposal)
}

func (p *ProposalModule) getProposal(id uint64) *Proposal {
	value, ok := p.proposals.Get(seqid.ID(id).String())
	if !ok {
		return nil
	}
	proposal := value.(*Proposal)
	return proposal
}
