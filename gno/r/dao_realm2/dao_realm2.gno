package dao_realm2

import (
	"gno.land/p/teritori/dao_roles_based"
	"gno.land/r/teritori/social_feeds"
)

var dao *dao_roles_based.DaoRolesBased

func init() {
	var rolesJSON = `["admin","public-relationships","finance-officer","member"]`
	var membersJSON = `[{"address":"g126gx6p6d3da4ymef35ury6874j6kys044r7zlg","roles":["admin","public-relationships","member"]},{"address":"g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv","roles":["public-relationships","member"]},{"address":"g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth","roles":["finance-officer","member"]},{"address":"g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r","roles":["member"]}]`
	var resourcesJSON = `[{"resource":"social.publish_post","condition":{"type":"role-count","role":"public-relationships","count":"1"}},{"resource":"wallet.send","condition":{"type":"OR","conditions":[{"type":"members-threshold","threshold":"60"},{"type":"role-count","role":"finance-officer","count":"1"}]}}]`

	messagesHandlers := []dao_roles_based.MessageHandler{
		social_feeds.NewCreatePostHandler(),
	}

	dao = dao_roles_based.NewDaoRolesBasedJSON(rolesJSON, membersJSON, resourcesJSON, messagesHandlers)

}

func Proposal(title, description string) {
	dao.NewProposal(title, description, "social.publish_post")
}

func Vote(proposalID uint64, vote string) {
	dao.Vote(proposalID, vote)
}

func Render(path string) string {
	return dao.Render()
}
