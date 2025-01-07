package dao2

import (
	"std"

	"gno.land/p/demo/avl"
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
		roleManager: role_manager.NewWithAddress(std.CurrentRealm().Addr()),
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
