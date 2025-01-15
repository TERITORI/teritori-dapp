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

// TODO: FIX the owner of the role_manager is the deployer of the contract not the realm
func newMemberModule() *MemberModule {
	return &MemberModule{
		roleManager: role_manager.NewWithAddress(std.CurrentRealm().Addr()),
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

func (m *MemberModule) GetRoles() []string {
	return m.roleManager.GetRoles()
}

func (m *MemberModule) GetUserRoles(memberId string) []string {
	return m.roleManager.GetUserRoles(std.Address(memberId))
}

func (m *MemberModule) setRoles(roles []string) {
	caller := std.CurrentRealm().Addr()
	for _, role := range roles {
		m.roleManager.CreateNewRole(role, []string{}, caller)
	}
}

func (m *MemberModule) setMembers(members [][]string) {
	caller := std.CurrentRealm().Addr()
	for _, member := range members {
		m.members.Set(member[0], struct{}{})
		for _, role := range member[1:] {
			m.roleManager.AddRoleToUser(std.Address(member[0]), role, caller)
		}
	}
}
