package dao_realm

import (
	"gno.land/p/teritori/daokit"
	"gno.land/r/demo/profile"
)

var dao *daokit.DAO

func init() {
	dao = &daokit.DAO{}
	name := "Demo DAO"
	description := "This is a demo DAO"

	roles := []string{"admin", "public-relationships", "finance-officer"}
	members := []daokit.Member{
		{Address: "g126gx6p6d3da4ymef35ury6874j6kys044r7zlg", Roles: []string{"admin", "public-relationships"}},
		{Address: "g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv", Roles: []string{"public-relationships"}},
		{Address: "g1r69l0vhp7tqle3a0rk8m8fulr8sjvj4h7n0tth", Roles: []string{"finance-officer"}},
		{Address: "g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", Roles: []string{}},
	}

	condition := daokit.CreateCondition("members-treshold", &dao, 0.6)
	resources := []daokit.Resource{}

	dao = daokit.NewDAO(name, description, roles, members, resources, condition)

	profile.SetStringField(profile.DisplayName, name)
	profile.SetStringField(profile.Bio, description)
	profile.SetStringField(profile.Avatar, "")
}

func Render(path string) string {
	return dao.Render(path)
}
