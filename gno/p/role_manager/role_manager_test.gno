package role_manager

import (
	"fmt"
	"std"
	"testing"

	"gno.land/p/demo/testutils"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
)

func TestNewWithAddress(t *testing.T) {
	rm := NewWithAddress(bob)
	if rm.owner.Owner() != bob {
		t.Errorf("owner = %v, want %v", rm.owner.Owner(), bob)
	}
}

func TestNewRole(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	role := rm.mustGetRole("role1")
	userRole := rm.mustGetRole(ROLE_USER)
	if role.name != "role1" {
		t.Errorf("role.name = %v, want %v", role.name, "role1")
	}
	if len(role.permissions) != 2 {
		t.Errorf("len(role.permissions) = %v, want %v", len(role.permissions), 2)
	}
	if role.permissions[0] != "perm1" {
		t.Errorf("role.permissions[2] = %v, want %v", role.permissions[0], "perm1")
	}
	if role.permissions[1] != "perm2" {
		t.Errorf("role.permissions[1] = %v, want %v", role.permissions[1], "perm2")
	}
	if !role.isHigherThan(ROLE_USER) {
		t.Errorf("role.isHigherThan(ROLE_USER) = %v, want %v", role.isHigherThan(ROLE_USER), true)
	}
	if role.next != nil {
		t.Errorf("role.next = %v, want %v", role.next, nil)
	}
	if role.prev != userRole {
		t.Errorf("role.prev = %v, want %v", role.prev, userRole)
	}
	if userRole.isHigherThan("role1") {
		t.Errorf("userRole.isHigherThan(role1) = %v, want %v", userRole.isHigherThan("role1"), false)
	}
	if userRole.next != role {
		t.Errorf("userRole.next = %v, want %v", userRole.next, role)
	}
}

func TestAddRoleToUser(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	rm.AddRoleToUser("role1", alice)
	role := rm.mustGetRole("role1")
	if len(role.users) != 1 {
		t.Errorf("len(role.users) = %v, want %v", len(role.users), 1)
	}
	if role.users[0] != alice {
		t.Errorf("role.users[0] = %v, want %v", role.users[0], alice)
	}
	if !rm.HasRole(alice, "role1") {
		t.Errorf("HasRole(alice, role1) = %v, want %v", rm.HasRole(alice, "role1"), true)
	}

	if !rm.HasRole(alice, ROLE_USER) {
		t.Errorf("HasRole(alice, ROLE_USER) = %v, want %v", rm.HasRole(alice, ROLE_USER), true)
	}

	if !rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), true)
	}
	if !role.isHigherThan(ROLE_USER) {
		t.Errorf("role.isHigherThan(ROLE_USER) = %v, want %v", role.isHigherThan(ROLE_USER), true)
	}
}

func TestDeleteRole(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	rm.AddRoleToUser("role1", alice)
	rm.DeleteRole("role1")
	userRole := rm.mustGetRole(ROLE_USER)
	aliceUser := rm.mustGetUser(alice)
	if rm.HasRole(alice, "role1") {
		t.Errorf("HasRole(alice, role1) = %v, want %v", rm.HasRole(alice, "role1"), false)
	}
	if rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), false)
	}
	if aliceUser.highestRole != userRole {
		t.Errorf("alice.highestRole = %v, want %v", aliceUser.highestRole, userRole)
	}
	if userRole.next != nil {
		t.Errorf("userRole.next = %v, want %v", userRole.next, nil)
	}
}