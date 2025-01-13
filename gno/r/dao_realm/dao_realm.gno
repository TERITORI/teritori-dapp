package dao_realm

import (
	"gno.land/p/teritori/dao_roles_based"
	"gno.land/r/demo/profile"
	"gno.land/r/teritori/social_feeds"
)

var dao *dao_roles_based.DaoRolesBased

func init() {
	name := "Demo DAO"
	description := "This is a demo DAO"

	roles := []string{"admin", "public-relationships", "finance-officer"}
	members := [][]string{
		{"g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", "admin", "public-relationships"},
		{"g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", "public-relationships"},
		{"g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", "finance-officer"},
		{"g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r"},
	}

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

	dao = dao_roles_based.NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, messagesHandlers)

	profile.SetStringField(profile.DisplayName, name)
	profile.SetStringField(profile.Bio, description)
	profile.SetStringField(profile.Avatar, "")
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
	return dao.Render(path)
}
