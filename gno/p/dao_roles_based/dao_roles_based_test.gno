package dao_roles_based

// Test Dao Creation (done)
// Test Dao Has Role
// Test Dao IsMember
// Test Dao Proposal
// Test Dao Vote
// Test Dao Execute

import "testing"

func TestNewDaoRolesBasedJSON(t *testing.T) {
	name := "My DAO"
	description := "My DAO Description"
	roles := []string{"admin"}
	members := [][]string{{"0x1", "admin"}, {"0x2"}, {"0x3"}}
	resourcesJSON := `[]`
	handlers := []MessageHandler{}

	dao := NewDaoRolesBasedJSON(name, description, roles, members, resourcesJSON, handlers)
	roles = dao.MemberModule.GetRoles()
	if len(roles) != 1 {
		t.Errorf("Expected 1 role, got %d", len(roles))
	}
	if roles[0] != "admin" {
		t.Errorf("Expected role 'admin', got %s", roles[0])
	}

	for _, member := range members {
		address := member[0]
		if !dao.IsMember(address) {
			t.Errorf("Expected member %s to be a member", address)
		}
		if len(member) == 2 && !dao.HasRole(address, member[1]) {
			t.Errorf("Expected member %s to have role %s", address, member[1])
		}
	}

	resourcesLen := dao.ResourcesModule.resources.Size()
	if resourcesLen != 0 {
		t.Errorf("Expected 0 resources, got %d", resourcesLen)
	}
}
