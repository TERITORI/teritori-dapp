package dao_realm

import (
	"gno.land/p/teritori/basedao"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
	"gno.land/r/demo/profile"
)

var dao *basedao.DAO

func init() {
	dao = basedao.New(&basedao.Config{
		Name:        "Demo DAO",
		Description: "This is a demo DAO",
		Roles:       []string{"admin", "public-relationships", "finance-officer"},
		Members: []basedao.Member{
			{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{"admin", "public-relationships"}},
			{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{"public-relationships"}},
			{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{"finance-officer"}},
			{Address: "g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", Roles: []string{}},
		},
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
