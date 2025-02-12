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

	dao.MemberModule.SetRoles(roles)
	dao.MemberModule.SetMembers(members)

	// dao.MessagesRegistry.handlers.Iterate("", "", func(key string, value interface{}) bool {
	// 	dao.ResourcesModule.SetResource(Resource{
	// 		Resource:  key,
	// 		Handler:   value.(MessageHandler),
	// 		Condition: initCond,
	// 	})
	// 	return false
	// })

	for _, resource := range resources {
		dao.ResourcesModule.SetResource(resource)
		dao.MessagesRegistry.register(resource.Handler)
	}

	return dao
}

func (d *DAO) Propose(req ProposalRequest) *Proposal {
	proposer := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(proposer.String()) {
		panic(proposer + " proposer is not a member" + proposer)
	}

	condition := d.ResourcesModule.GetResource(req.Type)
	if condition == nil {
		panic("message type is not registered as a resource")
	}

	if len(req.Title) == 0 || len(req.Description) == 0 {
		panic("title or description is empty")
	}

	handler, ok := d.MessagesRegistry.handlers.Get(req.Type)
	if !ok {
		panic("message type is not registered as a resource")
	}

	message := handler.(MessageHandler).Instantiate(req.Payload)

	return d.ProposalModule.newProposal(req.Title, req.Description, proposer, message, condition.NewState())
}

func (d *DAO) Vote(proposalID uint64, vote string) {
	voter := std.PrevRealm().Addr()
	if !d.MemberModule.IsMember(voter.String()) {
		panic("voter is not a member")
	}

	proposal := d.ProposalModule.GetProposal(proposalID)
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

	proposal := d.ProposalModule.GetProposal(proposalID)
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

	d.MessagesRegistry.execute(proposal.message)
	proposal.status = ProposalStatusExecuted
}

func (d *DAO) InstantExecute(req ProposalRequest) {
	proposal := d.Propose(req)
	d.Vote(uint64(proposal.id), "yes")
	d.Execute(uint64(proposal.id))
}
