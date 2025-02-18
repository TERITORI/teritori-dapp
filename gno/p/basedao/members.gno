package basedao

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/teritori/role_manager"
)

type MembersStore struct {
	RoleManager *role_manager.RoleManager
	Members     *avl.Tree // address -> struct{}
}

type Member struct {
	Address string
	Roles   []string
}

func NewMembersStore(initialRoles []role_manager.RoleInfo, initialMembers []Member) *MembersStore {
	res := &MembersStore{
		RoleManager: role_manager.New(),
		Members:     avl.NewTree(),
	}
	res.setRoles(initialRoles)
	res.setMembers(initialMembers)
	return res
}

func (m *MembersStore) HasRole(memberId string, role string) bool {
	return m.RoleManager.HasRole(std.Address(memberId), role)
}

func (m *MembersStore) IsMember(memberId string) bool {
	return m.Members.Has(memberId)
}

func (m *MembersStore) MembersCount() uint64 {
	return uint64(m.Members.Size())
}

func (m *MembersStore) GetMembers() []string {
	members := make([]string, 0, m.Members.Size())
	m.Members.Iterate("", "", func(key string, value interface{}) bool {
		members = append(members, key)
		return false
	})
	return members
}

func (m *MembersStore) GetRoles() []string {
	return m.RoleManager.GetRoles()
}

func (m *MembersStore) GetMemberRoles(memberId string) []string {
	return m.RoleManager.GetUserRoles(std.Address(memberId))
}

func (m *MembersStore) CountMemberRoles(memberId string) int {
	return m.RoleManager.CountUserRoles(std.Address(memberId))
}

func (m *MembersStore) GetMembersWithRole(role string) []string {
	return m.RoleManager.GetRoleUsers(role)
}

func (m *MembersStore) CountMembersWithRole(role string) uint32 {
	return uint32(len(m.RoleManager.GetRoleUsers(role)))
}

func (m *MembersStore) setRoles(roles []role_manager.RoleInfo) {
	for _, role := range roles {
		m.RoleManager.CreateNewRole(role.Name, role.Description, []string{})
	}
}

func (m *MembersStore) setMembers(members []Member) {
	for _, member := range members {
		m.Members.Set(member.Address, struct{}{})
		for _, role := range member.Roles {
			m.RoleManager.AddRoleToUser(std.Address(member.Address), role)
		}
	}
}

func (m *MembersStore) AddMember(member string, roles []string) {
	if m.IsMember(member) {
		panic("member already exists")
	}
	m.Members.Set(member, struct{}{})
	for _, role := range roles {
		m.RoleManager.AddRoleToUser(std.Address(member), role)
	}
}

func (m *MembersStore) RemoveMember(member string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	m.Members.Remove(member)
	m.RoleManager.RemoveAllRolesFromUser(std.Address(member))
}

func (m *MembersStore) AddRoleToMember(member string, role string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	if !m.RoleManager.RoleExists(role) {
		panic("role does not exist")
	}
	if m.HasRole(member, role) {
		panic("member already has the role")
	}
	m.RoleManager.AddRoleToUser(std.Address(member), role)
}

func (m *MembersStore) RemoveRoleFromMember(member string, role string) {
	if !m.IsMember(member) {
		panic("member does not exist")
	}
	if !m.RoleManager.RoleExists(role) {
		panic("role does not exist")
	}
	if !m.HasRole(member, role) {
		panic("member does not have the role")
	}
	m.RoleManager.RemoveRoleFromUser(std.Address(member), role)
}

func (m *MembersStore) GetMembersJSON() string {
	// XXX: replace with protoc-gen-gno
	members := []*json.Node{}
	for _, memberID := range m.GetMembers() {
		roles := []*json.Node{}
		for _, role := range m.GetMemberRoles(memberID) {
			roles = append(roles, json.StringNode("", role))
		}
		members = append(members, json.ObjectNode("", map[string]*json.Node{
			"address": json.StringNode("", memberID),
			"roles":   json.ArrayNode("", roles),
		}))
	}
	node := json.ArrayNode("", members)
	bz, err := json.Marshal(node)
	if err != nil {
		panic(err)
	}
	return string(bz)
}
