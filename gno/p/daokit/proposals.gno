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
	ProposalStatusInvalidated
)

func (s ProposalStatus) String() string {
	switch s {
	case ProposalStatusOpen:
		return "Open"
	case ProposalStatusPassed:
		return "Passed"
	case ProposalStatusExecuted:
		return "Executed"
	case ProposalStatusInvalidated:
		return "Invalidated"
	default:
		return "Unknown"
	}
}

type Proposal struct {
	ID             seqid.ID
	Title          string
	Description    string
	CreatedAt      time.Time
	ProposerID     string
	ConditionState daocond.State
	Message        ExecutableMessage
	Status         ProposalStatus
	ExecutorID     string
	ExecutedAt     time.Time
	Votes          map[string]daocond.Vote
}

type ProposalModule struct {
	Proposals         *avl.Tree // int -> Proposal
	proposalIDCounter seqid.ID
}

type ProposalRequest struct {
	Title       string
	Description string
	Message     ExecutableMessage
}

func newProposalModule() *ProposalModule {
	return &ProposalModule{
		Proposals: avl.NewTree(),
	}
}

func (p *ProposalModule) newProposal(proposer string, req ProposalRequest, conditionState daocond.State) *Proposal {
	id := p.proposalIDCounter.Next()
	proposal := &Proposal{
		ID:             id,
		Title:          req.Title,
		Description:    req.Description,
		ProposerID:     proposer,
		Status:         ProposalStatusOpen,
		Message:        req.Message,
		ConditionState: conditionState,
		Votes:          map[string]daocond.Vote{},
		CreatedAt:      time.Now(),
	}
	p.Proposals.Set(id.String(), proposal)
	return proposal
}

func (p *ProposalModule) GetProposal(id uint64) *Proposal {
	value, ok := p.Proposals.Get(seqid.ID(id).String())
	if !ok {
		return nil
	}
	proposal := value.(*Proposal)
	return proposal
}

func (p *ProposalModule) InvalidateWithResource(resourceType string) {
	toInvalidate := map[string]*Proposal{}

	p.Proposals.Iterate("", "", func(k string, v interface{}) bool {
		proposal := v.(*Proposal)
		if proposal.Status == ProposalStatusOpen && proposal.Message.Type() == resourceType {
			proposal.Status = ProposalStatusInvalidated
			toInvalidate[k] = proposal
		}
		return false
	})

	for k, v := range toInvalidate {
		p.Proposals.Set(k, v)
	}
}

func (p *Proposal) UpdateStatus() {
	conditionsAreMet := p.ConditionState.Eval(p.Votes)
	if p.Status == ProposalStatusOpen && conditionsAreMet {
		p.Status = ProposalStatusPassed
	}
}
