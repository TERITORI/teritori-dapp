package govdao

import (
	"gno.land/p/teritori/daokit"
	"gno.land/r/demo/profile"
)

var dao *daokit.DAO

func init() {
	dao = &daokit.DAO{}
	name := "GovDAO"
	description := "This is a govDAO demo"

	roles := []string{"tier1", "tier2", "tier3"}
	members := []daokit.Member{
		{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{"tier1"}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{"tier2"}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{"tier1"}},
	}

	condition := daokit.CreateCondition("members-treshold", &dao, 0.6)
	resources := []daokit.Resource{}

	dao = daokit.NewDAO(name, description, roles, members, resources, condition)

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
