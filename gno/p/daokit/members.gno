package daokit

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/teritori/role_manager"
)

type MemberModule struct {
	roleManager *role_manager.RoleManager
	members     *avl.Tree // address -> struct{}
}

type Member struct {
	Address string
	Roles   []string
}

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

func (m *MemberModule) GetMembers() []string {
	members := make([]string, 0, m.members.Size())
	m.members.Iterate("", "", func(key string, value interface{}) bool {
		members = append(members, key)
		return false
	})
	return members
}

func (m *MemberModule) GetRoles() []string {
	return m.roleManager.GetRoles()
}

func (m *MemberModule) GetMemberRoles(memberId string) []string {
	return m.roleManager.GetUserRoles(std.Address(memberId))
}

func (m *MemberModule) CountMemberRoles(memberId string) int {
	return m.roleManager.CountUserRoles(std.Address(memberId))
}

func (m *MemberModule) GetMembersWithRole(role string) []string {
	return m.roleManager.GetRoleUsers(role)
}

func (m *MemberModule) SetRoles(roles []string) {
	caller := std.CurrentRealm().Addr()
	for _, role := range roles {
		m.roleManager.CreateNewRole(role, []string{}, caller)
	}
}

func (m *MemberModule) SetMembers(members []Member) {
	caller := std.CurrentRealm().Addr()
	for _, member := range members {
		m.members.Set(member.Address, struct{}{})
		for _, role := range member.Roles {
			m.roleManager.AddRoleToUser(std.Address(member.Address), role, caller)
		}
	}
}

func (m *MemberModule) AddMember(member string, roles []string) {
	if m.IsMember(member) {
		panic("member already exists")
	}
	caller := std.CurrentRealm().Addr()
	m.members.Set(member, struct{}{})
	for _, role := range roles {
		m.roleManager.AddRoleToUser(std.Address(member), role, caller)
	}
}

func (m *MemberModule) RemoveMember(member string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	m.members.Remove(member)
	m.roleManager.RemoveAllRolesFromUser(std.Address(member), std.CurrentRealm().Addr())
}

func (m *MemberModule) AddRoleToMember(member string, role string) {
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

func (m *MemberModule) RemoveRoleFromMember(member string, role string) {
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
