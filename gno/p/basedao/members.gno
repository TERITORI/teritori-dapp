package basedao

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/teritori/role_manager"
)

type membersStore struct {
	roleManager *role_manager.RoleManager
	members     *avl.Tree // address -> struct{}
}

type Member struct {
	Address string
	Roles   []string
}

// TODO: FIX the owner of the role_manager is the deployer of the contract not the realm
func newMembersStore() *membersStore {
	return &membersStore{
		roleManager: role_manager.NewWithAddress(std.CurrentRealm().Addr()),
		members:     avl.NewTree(),
	}
}

func (m *membersStore) HasRole(memberId string, role string) bool {
	return m.roleManager.HasRole(std.Address(memberId), role)
}

func (m *membersStore) IsMember(memberId string) bool {
	return m.members.Has(memberId)
}

func (m *membersStore) MembersCount() uint64 {
	return uint64(m.members.Size())
}

func (m *membersStore) GetMembers() []string {
	members := make([]string, 0, m.members.Size())
	m.members.Iterate("", "", func(key string, value interface{}) bool {
		members = append(members, key)
		return false
	})
	return members
}

func (m *membersStore) GetRoles() []string {
	return m.roleManager.GetRoles()
}

func (m *membersStore) GetMemberRoles(memberId string) []string {
	return m.roleManager.GetUserRoles(std.Address(memberId))
}

func (m *membersStore) CountMemberRoles(memberId string) int {
	return m.roleManager.CountUserRoles(std.Address(memberId))
}

func (m *membersStore) GetMembersWithRole(role string) []string {
	return m.roleManager.GetRoleUsers(role)
}

func (m *MemberModule) CountMembersWithRole(role string) int {
	return len(m.roleManager.GetRoleUsers(role))
}

func (m *membersStore) setRoles(roles []string) {
	caller := std.CurrentRealm().Addr()
	for _, role := range roles {
		m.roleManager.CreateNewRole(role, []string{}, caller)
	}
}

func (m *membersStore) setMembers(members []Member) {
	caller := std.CurrentRealm().Addr()
	for _, member := range members {
		m.members.Set(member.Address, struct{}{})
		for _, role := range member.Roles {
			m.roleManager.AddRoleToUser(std.Address(member.Address), role, caller)
		}
	}
}

// TODO: add test for this kind of proposals
func (m *membersStore) addMember(member string, roles []string) {
	if m.IsMember(member) {
		panic("member already exists")
	}
	caller := std.CurrentRealm().Addr()
	m.members.Set(member, struct{}{})
	for _, role := range roles {
		m.roleManager.AddRoleToUser(std.Address(member), role, caller)
	}
}

func (m *membersStore) removeMember(member string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	m.members.Remove(member)
	m.roleManager.RemoveAllRolesFromUser(std.Address(member), std.CurrentRealm().Addr())
}

func (m *membersStore) addRoleToMember(member string, role string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	if !m.roleManager.RoleExists(role) {
		panic("role does not exist")
	}
	if m.HasRole(member, role) {
		panic("member already has the role")
	}
	m.roleManager.AddRoleToUser(std.Address(member), role, std.CurrentRealm().Addr())
}

func (m *membersStore) removeRoleFromMember(member string, role string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	if !m.roleManager.RoleExists(role) {
		panic("role does not exist")
	}
	if !m.HasRole(member, role) {
		panic("member does not have the role")
	}
	m.roleManager.RemoveRoleFromUser(std.Address(member), role, std.CurrentRealm().Addr())
}
