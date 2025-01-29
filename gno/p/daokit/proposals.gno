package daokit

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
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
	// MinVotingPeriod dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	// Expiration      dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	message ExecutableMessage
	status  ProposalStatus
	votes   map[string]daocond.Vote
}

type ProposalModule struct {
	proposals         *avl.Tree // int -> Proposal
	proposalIDCounter seqid.ID
}

type ProposalRequest struct {
	title       string
	description string
	message     *json.Node
}

func newProposalModule() *ProposalModule {
	return &ProposalModule{
		proposals: avl.NewTree(),
	}
}

func (p *ProposalModule) newProposal(title, description string, proposer std.Address, message ExecutableMessage, state daocond.State) *Proposal {
	id := p.proposalIDCounter.Next()
	proposal := &Proposal{
		id:          id,
		title:       title,
		description: description,
		proposer:    proposer,
		status:      ProposalStatusOpen,
		message:     message,
		state:       state,
		votes:       map[string]daocond.Vote{},
	}
	p.proposals.Set(id.String(), proposal)
	return proposal
}

func (p *ProposalModule) getProposal(id uint64) *Proposal {
	value, ok := p.proposals.Get(seqid.ID(id).String())
	if !ok {
		return nil
	}
	proposal := value.(*Proposal)
	return proposal
}

func (p *Proposal) updateStatus() {
	conditionsAreMet := p.state.Eval(p.votes)
	if p.status == ProposalStatusOpen && conditionsAreMet {
		p.status = ProposalStatusPassed
	}
}

func (pr *ProposalRequest) fromJSON(ast *json.Node) {
	obj := ast.MustObject()
	pr.title = obj["title"].MustString()
	pr.description = obj["description"].MustString()
	pr.message = obj["message"]
}
