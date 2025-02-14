package daokit

import (
	"time"

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
	id             seqid.ID
	title          string
	description    string
	createdAt      time.Time
	proposerID     string
	resourceType   string
	conditionState daocond.State
	// MinVotingPeriod dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	// Expiration      dao_utils.Expiration // copy here the dao_utils.Expiration type from gno/p/dao_utils/expiration.gno
	message    ExecutableMessage
	status     ProposalStatus
	executorID string
	executedAt time.Time
	votes      map[string]daocond.Vote
}

type ProposalModule struct {
	proposals         *avl.Tree // int -> Proposal
	proposalIDCounter seqid.ID
}

type ProposalRequest struct {
	Title       string
	Description string
	Message     ExecutableMessage
}

func newProposalModule() *ProposalModule {
	return &ProposalModule{
		proposals: avl.NewTree(),
	}
}

func (p *ProposalModule) newProposal(proposer string, req ProposalRequest, conditionState daocond.State) *Proposal {
	id := p.proposalIDCounter.Next()
	proposal := &Proposal{
		id:             id,
		title:          req.Title,
		description:    req.Description,
		proposerID:     proposer,
		status:         ProposalStatusOpen,
		message:        req.Message,
		conditionState: conditionState,
		votes:          map[string]daocond.Vote{},
		createdAt:      time.Now(),
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
	conditionsAreMet := p.conditionState.Eval(p.votes)
	if p.status == ProposalStatusOpen && conditionsAreMet {
		p.status = ProposalStatusPassed
	}
}
