package dao_realm2

import (
	"gno.land/p/demo/avl"
	"gno.land/p/teritori/dao2"
	"gno.land/p/teritori/daocond"
)

var dao *dao2.Dao

func init() {
	dao = dao2.NewDao()

	dao.SetRoles([]string{"admin", "public-relationships", "finance-officer", "member"})
	dao.SetMembers([][]string{
		{"g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", "admin", "public-relationships", "member"},
		{"g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", "public-relationships", "member"},
		{"g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", "finance-officer", "member"},
		{"g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", "member"},
	})

	var resourceJSON = `{"type":"AND","conditions":[{"type":"role-count","role":"public-relationships","count":"1"},{"type":"OR","conditions":[{"type":"members-threshold","threshold":"6"},{"type":"role-count","role":"finance-officer","count":"1"}]}]}`

	condition := daocond.ConditionFromJSON(resourceJSON, dao.HasRoleFn, dao.IsMemberFn, dao.MembersCountFn)
	resources := avl.NewTree()
	resources.Set("social.publish_post", condition)
	dao.SetResources(resources)

}

func Render(path string) string {
	return dao.Render()
}
