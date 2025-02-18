package daokit

import (
	"errors"
	"time"

	"gno.land/p/teritori/daocond"
)

type Core struct {
	Resources      *resourcesStore
	ProposalModule *ProposalModule
	NoEvents       bool
}

func NewCore() *Core {
	return &Core{
		Resources:      newResourcesStore(),
		ProposalModule: newProposalModule(),
	}
}

func (d *Core) SetResource(res *Resource) {
	d.Resources.setResource(res)
}

func (d *Core) Vote(voterID string, proposalID uint64, vote daocond.Vote) {
	proposal := d.ProposalModule.GetProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.Status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	if !d.NoEvents {
		e := &daocond.EventVote{
			VoterID: voterID,
			Vote:    daocond.Vote(vote),
		}
		proposal.ConditionState.HandleEvent(e, proposal.Votes)
	}

	proposal.Votes[voterID] = daocond.Vote(vote)

}

func (d *Core) Execute(proposalID uint64) {
	proposal := d.ProposalModule.GetProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.Status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	if !proposal.ConditionState.Eval(proposal.Votes) {
		panic("proposal condition is not met")
	}

	proposal.UpdateStatus()
	if proposal.Status != ProposalStatusPassed {
		panic("proposal does not meet the condition(s) or is already closed/executed")
	}

	d.Resources.getResource(proposal.Message.Type()).Handler.Execute(proposal.Message)
	proposal.Status = ProposalStatusExecuted
	proposal.ExecutedAt = time.Now()
}

func (d *Core) Propose(proposerID string, req ProposalRequest) {
	d.propose(proposerID, req)
}

func (d *Core) InstantExecute(executorID string, req ProposalRequest) {
	proposal := d.propose(executorID, req)
	d.Vote(executorID, uint64(proposal.ID), "yes")
	d.Execute(uint64(proposal.ID))
}

func (d *Core) ResourcesCount() int {
	return d.Resources.Resources.Size()
}

func (d *Core) propose(proposer string, req ProposalRequest) *Proposal {
	messageType := req.Message.Type()

	resource := d.Resources.getResource(messageType)
	if resource == nil {
		panic("message type is not registered as a resource")
	}

	return d.ProposalModule.newProposal(proposer, req, resource.Condition.NewState())
}

const MsgAddResourceKind = "gno.land/p/teritori/daokit.AddResource"

func NewAddResourceHandler(d *Core) MessageHandler {
	return NewMessageHandler(MsgAddResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}

		d.SetResource(payload)
		d.ProposalModule.InvalidateWithResource(payload.Handler.Type())
	})
}

func NewAddResourceMsg(payload *Resource) ExecutableMessage {
	return NewMessage(MsgAddResourceKind, payload)
}

const MsgRemoveResourceKind = "gno.land/p/teritori/daokit.RemoveResource"

func NewRemoveResourceHandler(d *Core) MessageHandler {
	return NewMessageHandler(MsgRemoveResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		if d.Resources.getResource(payload.Handler.Type()) == nil {
			panic("ressource " + payload.Handler.Type() + " does not exists")
		}
		d.Resources.removeResource(payload)
		d.ProposalModule.InvalidateWithResource(payload.Handler.Type())
	})
}

func NewRemoveResourceMsg(payload *Resource) ExecutableMessage {
	return NewMessage(MsgRemoveResourceKind, payload)
}
