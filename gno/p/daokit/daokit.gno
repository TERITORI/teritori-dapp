package daokit

import (
	"path"
	"std"

	"gno.land/p/demo/json"
	"gno.land/p/demo/mux"
	"gno.land/p/teritori/daocond"
)

type DAO struct {
	Name        string
	Description string

	MemberModule     *MemberModule
	ResourcesModule  *ResourcesModule
	ProposalModule   *ProposalModule
	MessagesRegistry *MessagesRegistry

	renderingRouter *mux.Router
	realmName       string
}

func NewDAO(name, description string, roles []string, members []Member, resources []Resource, initCond daocond.Condition) *DAO {
	if len(name) < 1 || len(description) < 1 {
		panic("name or description is empty")
	}

	dao := &DAO{
		Name:             name,
		Description:      description,
		MemberModule:     newMemberModule(),
		ResourcesModule:  newResourcesModule(),
		ProposalModule:   newProposalModule(),
		MessagesRegistry: newMessagesRegistry(),
		renderingRouter:  mux.NewRouter(),
		realmName:        path.Base(std.CurrentRealm().PkgPath()),
	}
	dao.initMessagesRegistry()
	dao.initRenderingRouter()

	dao.MemberModule.setRoles(roles)
	dao.MemberModule.setMembers(members)

	dao.MessagesRegistry.handlers.Iterate("", "", func(key string, value interface{}) bool {
		dao.ResourcesModule.setResource(Resource{
			Resource:  key,
			Handler:   value.(MessageHandler),
			Condition: initCond,
		})
		return false
	})

	for _, resource := range resources {
		dao.ResourcesModule.setResource(resource)
		dao.MessagesRegistry.register(resource.Handler)
	}

	return dao
}

func (d *DAO) Vote(proposalID uint64, vote string) {
	voter := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(voter.String()) {
		panic("voter is not a member")
	}

	proposal := d.ProposalModule.getProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	if daocond.Vote(vote) != daocond.VoteYes && daocond.Vote(vote) != daocond.VoteNo && daocond.Vote(vote) != daocond.VoteAbstain {
		panic("invalid vote")
	}

	e := &daocond.EventVote{
		VoterID: voter.String(),
		Vote:    daocond.Vote(vote),
	}

	proposal.state.HandleEvent(e, proposal.votes)
	proposal.votes[voter.String()] = daocond.Vote(vote)

}

func (d *DAO) Execute(proposalID uint64) {
	executor := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(executor.String()) {
		panic("executor is not a member")
	}

	proposal := d.ProposalModule.getProposal(proposalID)
	if proposal == nil {
		panic("proposal not found")
	}

	if proposal.status != ProposalStatusOpen {
		panic("proposal is not open")
	}

	if !proposal.state.Eval(proposal.votes) {
		panic("proposal condition is not met")
	}

	proposal.updateStatus()
	if proposal.status != ProposalStatusPassed {
		panic("proposal does not meet the condition(s) or is already closed/executed")
	}

	d.MessagesRegistry.execute(proposal.message)
	proposal.status = ProposalStatusExecuted
}

func (d *DAO) ProposeJSON(proposalJSON string) {
	var req ProposalRequest
	req.fromJSON(json.Must(json.Unmarshal([]byte(proposalJSON))))
	msg := d.MessagesRegistry.messageFromJSON(req.message)
	d.propose(req.title, req.description, msg.Type(), msg)
}

func (d *DAO) InstantExecute(proposalJSON string) {
	var req ProposalRequest
	req.fromJSON(json.Must(json.Unmarshal([]byte(proposalJSON))))
	msg := d.MessagesRegistry.messageFromJSON(req.message)
	proposal := d.propose(req.title, req.description, msg.Type(), msg)
	d.Vote(uint64(proposal.id), "yes")
	d.Execute(uint64(proposal.id))
}

func (d *DAO) propose(title, description, resource string, message ExecutableMessage) *Proposal {
	proposer := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(proposer.String()) {
		panic(proposer + " proposer is not a member" + proposer)
	}

	condition := d.ResourcesModule.getResource(resource)
	if condition == nil {
		panic("resource not found")
	}

	if len(title) < 3 {
		panic("title should be at least 9 characters long")
	}

	if len(description) < 3 {
		panic("description should be at least 15 characters long")
	}

	return d.ProposalModule.newProposal(title, description, proposer, message, condition.NewState())
}
