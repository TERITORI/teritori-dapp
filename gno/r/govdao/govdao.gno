package govdao

import (
	"gno.land/p/teritori/basedao"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
	"gno.land/p/teritori/role_manager"
	"gno.land/r/demo/profile"
	"gno.land/r/gnoland/ghverify"
)

const (
	Tier1 = "T1"
	Tier2 = "T2"
	Tier3 = "T3"
)

var (
	dao                *basedao.DAO
	getAddressByHandle func(handle string) string
)

func init() {
	initialRoles := []role_manager.RoleInfo{
		{Name: Tier1, Description: "Self-selecting \"core\" with supermajority vote from T1. A T1 member gets 3 votes."},
		{Name: Tier2, Description: "Selected by GovDAO w/ T3 abstaining, with simple majority vote. A T2 member gets 2 votes."},
		{Name: Tier3, Description: "Permissionless invitation from T1 and T2. A T3 member gets 1 vote."},
	}

	// ⚠️ No T3 member should be initially added to the DAO since we want to add them only with invitations (see invitations.gno)
	initialMembers := []basedao.Member{
		{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{Tier1}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{Tier2}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{Tier2}},
	}
	dao = basedao.New(&basedao.Config{
		Name:              "GovDAO",
		Description:       "This is a GovDAO demo",
		NoDefaultHandlers: true,
		Members:           basedao.NewMembersStore(initialRoles, initialMembers),
		GetProfileString:  profile.GetStringField,
	})

	t1Supermajority := daocond.RoleThreshold(0.66, Tier1, dao.Members.HasRole, dao.Members.CountMembersWithRole)
	supermajority := daocond.GovDaoCondThreshold(0.66, dao.Members.HasRole, dao.Members.CountMembersWithRole)
	majority := daocond.GovDaoCondThreshold(0.5, dao.Members.HasRole, dao.Members.CountMembersWithRole)

	resources := []*daokit.Resource{
		{
			Handler:   NewAddT1MemberHandler(dao),
			Condition: t1Supermajority,
		},
		{
			Handler:   NewAddT2MemberHandler(dao),
			Condition: majority,
		},
		{
			Handler:   basedao.NewEditProfileHandler(profile.SetStringField, nil),
			Condition: supermajority,
		},
	}
	for _, r := range resources {
		dao.Core.SetResource(r)
	}
	getAddressByHandle = ghverify.GetAddressByHandle
	dao.RenderRouter.HandleFunc(CLAIM_PATH, renderClaimableTiers)
}

func Propose(proposal daokit.ProposalRequest) {
	dao.Propose(proposal)
}

func Vote(proposalID uint64, vote daocond.Vote) {
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
