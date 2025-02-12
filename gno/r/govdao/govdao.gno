package govdao

import (
	"gno.land/p/teritori/daokit"
	"gno.land/r/demo/profile"
)

var dao *daokit.DAO

// HOW HANDLE DEFAULT MESSAGES (ADD NEW MEMBER, REMOVE MEMBER, ADD ROLE, REMOVE ROLE)
// WE WANT TO BE ABLE TO JUST ADD TIER1, TIER2, TIER3 MEMBERS NOT OTHER MESSAGE TYPES
// OPTIONS:
// - CREATE A NEW CONDITION THAT RESPOND ALWAYS FALSE AND BLOCK THESE MESSAGES (the messages still exist and people can create proposal that will never be executed)
// - ALLOW USERS TO SELECT AT THE CREATION WHICH DEFAULT MESSAGES THEY WANT TO USE (list of strings)
// - REMOVE DEFAULT MESSAGES FROM THE MESSAGES REGISTRY AND GIVE THE TASK TO THE USER TO SET THEM AT THE CREATION (can import the default messages from daokit)
// I like the last option, it gives more flexibility to the user and the user can still use the default messages if he wants to

func init() {
	dao = &daokit.DAO{}
	name := "GovDAO"
	description := "This is a govDAO demo"

	roles := []string{"tier1", "tier2", "tier3"}
	members := []daokit.Member{
		{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{"tier1"}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{"tier2"}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{"tier1"}},
		{Address: "g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", Roles: []string{"tier3"}},
		{Address: "g1ctt28t7sdyp28qzkvlfyx0hyxuz6vz7nplwm9c", Roles: []string{"tier3"}},
	}

	t1condition := daokit.CreateCondition("role-treshold", &dao, "tier1", 0.66) // rework for a treshold_roles condition
	t2condition := daokit.CreateCondition("gov-dao", &dao, 0.5)                 // use the govdao condition
	resources := []daokit.Resource{
		{
			Resource:  "gno.land/r/teritori/govdao.AddNewT1Member",
			Handler:   NewAddNewT1MemberMessageHandler(dao), // add a pointer of the dao to the handler
			Condition: t1condition,
		},
		{
			Resource:  "gno.land/r/teritori/govdao.AddNewT2Member",
			Handler:   NewAddNewT2MemberMessageHandler(dao), // add a pointer of the dao to the handler
			Condition: t2condition,
		},
	}
	initCondition := daokit.CreateCondition("members-treshold", &dao, 0.5)

	dao = daokit.NewDAO(name, description, roles, members, resources, initCondition)

	profile.SetStringField(profile.DisplayName, name)
	profile.SetStringField(profile.Bio, description)
	profile.SetStringField(profile.Avatar, "")
}

func Propose(proposal daokit.ProposalRequest) {
	dao.Propose(proposal)
}

func Vote(proposalID uint64, vote string) {
	dao.Vote(proposalID, vote)
}

func Execute(proposalID uint64) {
	dao.Execute(proposalID)
}

func InstantExecute(proposal daokit.ProposalRequest) {
	dao.InstantExecute(proposal)
}

func Render(path string) string {
	return dao.Render(path)
}
