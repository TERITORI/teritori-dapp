package dao_roles_based

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/teritori/role_manager"
)

type MemberModule struct {
	roleManager *role_manager.RoleManager
	members     *avl.Tree // address -> struct{}
}

func newMemberModule() *MemberModule {
	return &MemberModule{
		roleManager: role_manager.NewWithAddress(std.PrevRealm().Addr()),
		members:     avl.NewTree(),
	}
}

func (m *MemberModule) HasRole(memberId string, role string) bool {
	return m.roleManager.HasRole(std.Address(memberId), role)
}

func (m *MemberModule) IsMember(memberId string) bool {
	return m.members.Has(memberId)
}

func (m *MemberModule) MembersCount() uint64 {
	return uint64(m.members.Size())
}

func (m *MemberModule) setRoles(roles []string) {
	for _, role := range roles {
		m.roleManager.CreateNewRole(role, []string{})
	}
}

func (m *MemberModule) setMembers(members [][]string) {
	for _, member := range members {
		m.members.Set(member[0], struct{}{})
		for _, role := range member[1:] {
			m.roleManager.AddRoleToUser(std.Address(member[0]), role)
		}
	}
}
