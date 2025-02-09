package daokit

import (
	"path"
	"std"

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

	proposal.conditionState.HandleEvent(e, proposal.votes)
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

	if !proposal.conditionState.Eval(proposal.votes) {
		panic("proposal condition is not met")
	}

	proposal.updateStatus()
	if proposal.status != ProposalStatusPassed {
		panic("proposal does not meet the condition(s) or is already closed/executed")
	}

	d.MessagesRegistry.execute(proposal.message)
	proposal.status = ProposalStatusExecuted
}

func (d *DAO) Propose(req ProposalRequest) {
	d.propose(req.Title, req.Description, req.Type, req.Payload)
}

func (d *DAO) InstantExecute(req ProposalRequest) {
	proposal := d.propose(req.Title, req.Description, req.Type, req.Payload)
	d.Vote(uint64(proposal.id), "yes")
	d.Execute(uint64(proposal.id))
}

func (d *DAO) propose(title string, description string, messageType string, payload map[string]interface{}) *Proposal {
	proposer := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(proposer.String()) {
		panic(proposer + " proposer is not a member" + proposer)
	}

	condition := d.ResourcesModule.getResource(messageType)
	if condition == nil {
		panic("message type is not registered as a resource")
	}

	if len(title) == 0 || len(description) == 0 {
		panic("title or description is empty")
	}

	handler, ok := d.MessagesRegistry.handlers.Get(messageType)
	if !ok {
		panic("message type is not registered as a resource")
	}

	message := handler.(MessageHandler).Instantiate(payload)

	return d.ProposalModule.newProposal(title, description, proposer, message, condition.NewState())
}
