package dao_realm2

import (
	"gno.land/p/teritori/dao2"
)

func init() {
	dao := dao2.NewDao()

	dao.SetRoles([]string{"admin", "community", "financial", "member"})
	dao.SetMembers([][]string{
		{"g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", "admin"},
		{"g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", "community"},
		{"g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", "financial"},
		{"g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", "member"},
	})

}
