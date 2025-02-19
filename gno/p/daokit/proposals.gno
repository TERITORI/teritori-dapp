package daokit

import (
	"errors"
	"std"
	"time"

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
	ID             seqid.ID
	Title          string
	Description    string
	CreatedAt      time.Time
	CreatedHeight  int64
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
		CreatedHeight:  std.GetHeight(),
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

func (p *Proposal) UpdateStatus() {
	conditionsAreMet := p.ConditionState.Eval(p.Votes)
	if p.Status == ProposalStatusOpen && conditionsAreMet {
		p.Status = ProposalStatusPassed
	}
}

func (p *ProposalModule) GetProposalsJSON() string {
	props := make([]*json.Node, 0, p.Proposals.Size())
	// XXX: pagination
	p.Proposals.Iterate("", "", func(key string, value interface{}) bool {
		prop, ok := value.(*Proposal)
		if !ok {
			panic(errors.New("unexpected invalid proposal type"))
		}
		prop.UpdateStatus()
		props = append(props, json.ObjectNode("", map[string]*json.Node{
			"id":          json.NumberNode("", float64(prop.ID)),
			"title":       json.StringNode("", prop.Title),
			"description": json.StringNode("", prop.Description),
			"proposer":    json.StringNode("", prop.ProposerID),
			"status":      json.StringNode("", prop.Status.String()),
			"startHeight": json.NumberNode("", float64(prop.CreatedHeight)),
			"signal":      json.NumberNode("", prop.ConditionState.Signal(prop.Votes)),
		}))
		return false
	})
	bz, err := json.Marshal(json.ArrayNode("", props))
	if err != nil {
		panic(err)
	}
	return string(bz)
}
