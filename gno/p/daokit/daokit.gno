package daokit

import (
	"path"
	"std"
	"time"

	"gno.land/p/demo/mux"
	"gno.land/p/teritori/daocond"
)

type Core struct {
	resources      *resourcesStore
	ProposalModule *ProposalModule

	renderingRouter *mux.Router
	realmName       string
}

func NewCore() *Core {
	dao := &Core{
		resources:       newResourcesStore(),
		ProposalModule:  newProposalModule(),
		renderingRouter: mux.NewRouter(),
		realmName:       path.Base(std.CurrentRealm().PkgPath()),
	}
	dao.initRenderingRouter()

	return dao
}

func (d *Core) SetResource(res *Resource) {
	d.resources.setResource(res)
}

func (d *Core) Vote(voterID string, proposalID uint64, vote daocond.Vote) {
	proposal := d.ProposalModule.getProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	e := &daocond.EventVote{
		VoterID: voterID,
		Vote:    daocond.Vote(vote),
	}

	proposal.conditionState.HandleEvent(e, proposal.votes)
	proposal.votes[voterID] = daocond.Vote(vote)

}

func (d *Core) Execute(proposalID uint64) {
	proposal := d.ProposalModule.getProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	if !proposal.conditionState.Eval(proposal.votes) {
		panic("proposal condition is not met")
	}

	proposal.UpdateStatus()
	if proposal.status != ProposalStatusPassed {
		panic("proposal does not meet the condition(s) or is already closed/executed")
	}

	d.resources.getResource(proposal.resourceType).Handler.Execute(proposal.message)
	proposal.status = ProposalStatusExecuted
	proposal.executedAt = time.Now()
}

func (d *Core) Propose(proposerID string, req ProposalRequest) {
	d.propose(proposerID, req)
}

func (d *Core) InstantExecute(executorID string, req ProposalRequest) {
	proposal := d.propose(executorID, req)
	d.Vote(executorID, uint64(proposal.id), "yes")
	d.Execute(uint64(proposal.id))
}

func (d *Core) ResourcesCount() int {
	return d.resources.resources.Size()
}

func (d *Core) propose(proposer string, req ProposalRequest) *Proposal {
	messageType := req.Message.Type()

	resource := d.resources.getResource(messageType)
	if resource == nil {
		panic("message type is not registered as a resource")
	}

	return d.ProposalModule.newProposal(proposer, req, resource.Condition.NewState())
}
