package dao_realm

import (
	"gno.land/p/teritori/basedao"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
	"gno.land/p/teritori/role_manager"
	"gno.land/r/demo/profile"
)

var dao *basedao.DAO

func init() {
	initialRoles := []role_manager.RoleInfo{
		{Name: "admin", Description: "Admin is the superuser"},
		{Name: "public-relationships", Description: "Responsible of communication with the public"},
		{Name: "finance-officer", Description: "Responsible of funds management"},
	}

	initialMembers := []basedao.Member{
		{Address: "g1tdjkvapz5jxap6zxf06dxp7g88kad72svpzcu9", Roles: []string{"admin", "public-relationships"}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{"public-relationships"}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{"finance-officer"}},
		{Address: "g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", Roles: []string{}},
	}

	dao = basedao.New(&basedao.Config{
		Name:             "Teritori Core DAO",
		Description:      "Teritori's team administrative DAO",
		ImageURI:         "ipfs://bafybeifhfkw2kt3samc4425qr2wncykjkfq2gbfcpkmj4x4lsdt2yk2bfu",
		Members:          basedao.NewMembersStore(initialRoles, initialMembers),
		GetProfileString: profile.GetStringField,
		SetProfileString: profile.SetStringField,
	})
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
