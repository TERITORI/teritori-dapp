package govdao

import (
	"gno.land/p/teritori/daokit"
	"gno.land/r/demo/profile"
)

const (
	Tier1 = "T1"
	Tier2 = "T2"
	Tier3 = "T3"
)

var dao *daokit.DAO

func init() {
	dao = &daokit.DAO{}
	name := "GovDAO"
	description := "This is a govDAO demo"

	// ⚠️ No T3 member should be initially added to the DAO since we want to add them only with invitations (see invitations.gno)
	roles := []string{"T1", "T2", "T3"}
	members := []daokit.Member{
		{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{Tier1}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{Tier2}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{Tier3}},
	}

	t1condition := daokit.CreateCondition("role-treshold", &dao, "T1", 0.66) // rework for a treshold_roles condition
	t2condition := daokit.CreateCondition("gov-dao", &dao, 0.5)              // use the govdao condition
	resources := []daokit.Resource{
		{
			Resource:  "gno.land/r/teritori/govdao.AddNewT1Member",
			Handler:   NewAddNewT1MemberMessageHandler(&dao),
			Condition: t1condition,
		},
		{
			Resource:  "gno.land/r/teritori/govdao.AddNewT2Member",
			Handler:   NewAddNewT2MemberMessageHandler(&dao),
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
