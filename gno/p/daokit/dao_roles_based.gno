package daokit

import (
	"path"
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/mux"
	"gno.land/p/teritori/daocond"
)

type Dao struct {
	Name        string
	Description string

	MemberModule     *MemberModule
	ResourcesModule  *ResourcesModule
	ProposalModule   *ProposalModule
	MessagesRegistry *MessagesRegistry

	renderingRouter *mux.Router
	realmName       string
}

func NewDaoJSON(name, description string, roles []string, members [][]string, resourcesJSON string, handlers []MessageHandler) *Dao {
	if len(name) < 1 {
		panic("dao name should be at least 1 characters long")
	}

	if len(description) < 1 {
		panic("dao description should be at least 1 characters long")
	}

	dao := &Dao{
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

	resources := dao.parseResourcesJSON(resourcesJSON)
	conditionRaw, ok := resources.Get("init")
	if !ok {
		panic("resources should have an 'init' condition")
	}
	condition := conditionRaw.(daocond.Condition)
	dao.MessagesRegistry.handlers.Iterate("", "", func(key string, value interface{}) bool {
		resources.Set(key, condition)
		return false
	})
	resources.Remove("init")

	dao.ResourcesModule.setResources(resources)

	for _, handler := range handlers {
		dao.MessagesRegistry.register(handler)
	}

	return dao
}

func (d *Dao) Vote(proposalID uint64, vote string) {
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

func (d *Dao) Execute(proposalID uint64) {
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

func (d *Dao) ProposeJSON(proposalJSON string) {
	var req ProposalRequest
	req.fromJSON(json.Must(json.Unmarshal([]byte(proposalJSON))))
	msg := d.MessagesRegistry.messageFromJSON(req.message)
	d.propose(req.title, req.description, msg.Type(), msg)
}

func (d *Dao) InstantExecute(proposalJSON string) {
	var req ProposalRequest
	req.fromJSON(json.Must(json.Unmarshal([]byte(proposalJSON))))
	msg := d.MessagesRegistry.messageFromJSON(req.message)
	proposal := d.propose(req.title, req.description, msg.Type(), msg)
	d.Vote(uint64(proposal.id), "yes")
	d.Execute(uint64(proposal.id))
}

func (d *Dao) propose(title, description, resource string, message ExecutableMessage) *Proposal {
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

func (d *Dao) parseResourcesJSON(resourcesJSON string) *avl.Tree {
	nodes, err := json.Unmarshal([]byte(resourcesJSON))
	if err != nil {
		panic("invalid resources json format")
	}
	resourcesNodesArray := nodes.MustArray()
	resources := avl.NewTree()
	for _, resourceNode := range resourcesNodesArray {
		resourceObj := resourceNode.MustObject()
		condition := daocond.ConditionFromJSON(resourceObj["condition"], d.MemberModule.HasRole, d.MemberModule.IsMember, d.MemberModule.MembersCount)
		resources.Set(resourceObj["resource"].MustString(), condition)
	}
	return resources
}
