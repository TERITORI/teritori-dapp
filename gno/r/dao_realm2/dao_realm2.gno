package dao_realm2

import (
	"gno.land/p/teritori/dao_roles_based"
	"gno.land/r/teritori/social_feeds"
)

var dao *dao_roles_based.DaoRolesBased

func init() {
	var rolesJSON = `["admin","public-relationships","finance-officer"]`
	var membersJSON = `[{"address":"g126gx6p6d3da4ymef35ury6874j6kys044r7zlg","roles":["admin","public-relationships"]},{"address":"g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv","roles":["public-relationships"]},{"address":"g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth","roles":["finance-officer"]},{"address":"g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r","roles":[]}]`

	messagesHandlers := []dao_roles_based.MessageHandler{
		social_feeds.NewCreatePostHandler(),
	}

	conditions := make(map[string]string)
	conditions[messagesHandlers[0].Type()] = `"condition":{"type":"AND","conditions":[{"type":"members-threshold","threshold":"60"},{"type":"role-count","role":"public-relationships","count":"1"}]}`

	var resourcesJSON = `[`
	for i, mh := range messagesHandlers {
		resourcesJSON += `{"resource":"` + mh.Type() + `",` + conditions[mh.Type()] + `}`
		if i < len(messagesHandlers)-1 {
			resourcesJSON += `,`
		}
	}
	resourcesJSON += `]`

	dao = dao_roles_based.NewDaoRolesBasedJSON(rolesJSON, membersJSON, resourcesJSON, messagesHandlers)

}

func ProposeJSON(proposalJSON string) {
	dao.ProposeJSON(proposalJSON)
}

func Execute(proposalID uint64) {
	dao.Execute(proposalID)
}

func Vote(proposalID uint64, vote string) {
	dao.Vote(proposalID, vote)
}

func Render(path string) string {
	return dao.Render()
}
