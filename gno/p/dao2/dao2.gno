package dao2

import (
	"std"
	"strings"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/role_manager"
)

type Dao struct {
	// xxx: is it useful to use a "complex" type like RoleManager here since the permissions are not used? (let not use it for now)
	roleManager *role_manager.RoleManager
	members     *avl.Tree // address -> struct{}
	resources   *avl.Tree // string -> daocond.Condition
}

func NewDao() *Dao {
	return &Dao{
		roleManager: role_manager.NewWithAddress(std.PrevRealm().Addr()),
		members:     avl.NewTree(),
		resources:   avl.NewTree(),
	}
}

func (d *Dao) SetRoles(roles []string) {
	for _, role := range roles {
		d.roleManager.CreateNewRole(role, []string{})
	}
}

func (d *Dao) SetMembers(members [][]string) {
	for _, member := range members {
		d.members.Set(member[0], struct{}{})
		for _, role := range member[1:] {
			d.roleManager.AddRoleToUser(std.Address(member[0]), role)
		}
	}
}

func (d *Dao) SetResources(resources *avl.Tree) {
	d.resources = resources
}

func (d *Dao) HasRoleFn(memberId string, role string) bool {
	return d.roleManager.HasRole(std.Address(memberId), role)
}

func (d *Dao) IsMemberFn(memberId string) bool {
	return d.members.Has(memberId)
}

func (d *Dao) MembersCountFn() uint64 {
	return uint64(d.members.Size())
}

func (d *Dao) Render() string {
	// DISPLAY ORG. WITH LIST OF MEMBERS AND ROLES ASSOCIATED
	// DISPLAY CONDITIONS
	w := strings.Builder{}

	w.WriteString(ufmt.Sprintf("# Decentralized Autonomous Organization\n"))

	w.WriteString(ufmt.Sprintf("## Members\n\n"))

	i := 1
	d.members.Iterate("", "", func(key string, value interface{}) bool {
		w.WriteString(ufmt.Sprintf("**Member %d: %s**\n", i, key))
		w.WriteString(ufmt.Sprintf("Roles:\n"))
		roles := d.roleManager.GetUserRoles(std.Address(key))
		for _, role := range roles {
			w.WriteString(ufmt.Sprintf("\t%s\n", role))
		}
		w.WriteString(ufmt.Sprintf("\n--------------------------------\n"))
		return false
	})

	w.WriteString(ufmt.Sprintf("## Resources\n\n"))

	d.resources.Iterate("", "", func(key string, value interface{}) bool {
		condition := value.(daocond.Condition)
		w.WriteString(ufmt.Sprintf("**Resource: %s**\n", key))
		w.WriteString(ufmt.Sprintf("Condition: %s\n", condition.Render()))
		w.WriteString(ufmt.Sprintf("\n--------------------------------\n"))
		return false
	})

	return w.String()
}
