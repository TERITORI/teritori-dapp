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
	perms := []string{"perm1", "perm2"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	role := rm.mustGetRole("role1")
	userRole := rm.mustGetRole(ROLE_USER)
	if role.name != "role1" {
		t.Errorf("role.name = %v, want %v", role.name, "role1")
	}
	if role.permissions.Size() != 2 {
		t.Errorf("len(role.permissions) = %v, want %v", role.permissions.Size(), 2)
	}
	if !role.permissions.Has("perm1") {
		t.Errorf("role.permissions[2] = %v, want %v", role.permissions.Has("perm1"), true)
	}
	if !role.permissions.Has("perm2") {
		t.Errorf("role.permissions[1] = %v, want %v", role.permissions.Has("perm2"), true)
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
	perms := []string{"perm1", "perm2"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	rm.AddRoleToUser("role1", alice)
	role := rm.mustGetRole("role1")
	if role.users.Size() != 1 {
		t.Errorf("len(role.users) = %v, want %v", role.users.Size(), 1)
	}
	if !role.users.Has(alice.String()) {
		t.Errorf("role.users[0] = %v, want %v", role.users.Has(alice.String()), true)
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
	perms := []string{"perm1", "perm2"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
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
	if aliceUser.highestRole.name != userRole.name {
		t.Errorf("alice.highestRole = %s, want %s", aliceUser.highestRole.name, userRole.name)
	}
}

func TestRemoveRoleToUser(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	perms := []string{"perm1", "perm2", "perm3"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
	rm.NewRole("role1", []string{"perm1", "perm2"}, ROLE_USER)
	rm.NewRole("role2", []string{"perm2", "perm3"}, ROLE_USER)
	rm.AddRoleToUser("role1", alice)
	rm.AddRoleToUser("role2", alice)
	rm.RemoveRoleToUser("role1", alice)
	aliceUser := rm.mustGetUser(alice)
	role := rm.mustGetRole("role1")
	if role.users.Size() != 0 {
		t.Errorf("len(role.users) = %v, want %v", role.users.Size(), 0)
	}
	if rm.HasRole(alice, "role1") {
		t.Errorf("HasRole(alice, role1) = %v, want %v", rm.HasRole(alice, "role1"), false)
	}
	if rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), false)
	}
	if !rm.HasRole(alice, "role2") {
		t.Errorf("HasRole(alice, role2) = %v, want %v", rm.HasRole(alice, "role2"), true)
	}
	if !rm.HasPermission(alice, "perm2") {
		t.Errorf("HasPermission(alice, perm2) = %v, want %v", rm.HasPermission(alice, "perm2"), true)
	}
	if !rm.HasPermission(alice, "perm3") {
		t.Errorf("HasPermission(alice, perm3) = %v, want %v", rm.HasPermission(alice, "perm3"), true)
	}
	if aliceUser.highestRole.name != "role2" {
		t.Errorf("alice.highestRole = %s, want %s", aliceUser.highestRole.name, "role2")
	}
	if !rm.HasRole(alice, ROLE_USER) {
		t.Errorf("HasRole(alice, ROLE_USER) = %v, want %v", rm.HasRole(alice, ROLE_USER), true)
	}
}

func TestNewPermission(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	rm.NewPermission("perm1")
	if !rm.permissions.Has("perm1") {
		t.Errorf("permissions[0] = %v, want %v", rm.permissions.Has("perm1"), true)
	}
	if rm.permissions.Size() != 1 {
		t.Errorf("len(permissions) = %v, want %v", rm.permissions.Size(), 1)
	}
}

func TestDeletePermission(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)
	rm.NewPermission("perm1")
	rm.NewRole("role1", []string{"perm1"}, ROLE_USER)
	rm.AddRoleToUser("role1", alice)
	rm.DeletePermission("perm1")
	if rm.permissions.Has("perm1") {
		t.Errorf("permissions[0] = %v, want %v", rm.permissions.Has("perm1"), false)
	}
	if rm.permissions.Size() != 0 {
		t.Errorf("len(permissions) = %v, want %v", rm.permissions.Size(), 0)
	}
	if rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), false)
	}
	role, _ := rm.roles.Get("role1")
	if role.(*Role).permissions.Has("perm1") {
		t.Errorf("role.permissions[0] = %v, want %v", role.(*Role).permissions.Has("perm1"), false)
	}
}

func TestAddPermissionToRole(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)

	perms := []string{"perm1", "perm2"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
	rm.AddPermissionToRole(ROLE_USER, "perm1")
	rm.AddRoleToUser(ROLE_USER, alice)
	if !rm.HasPermission(alice, "perm1") {
		t.Errorf("permissions[0] = %v, want %v", rm.HasPermission(alice, "perm1"), true)
	}
	if !rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), true)
	}
	if rm.HasPermission(alice, "perm2") {
		t.Errorf("HasPermission(alice, perm2) = %v, want %v", rm.HasPermission(alice, "perm2"), false)
	}
}

func TestRemovePermissionFromRole(t *testing.T) {
	rm := NewWithAddress(bob)
	std.TestSetOrigCaller(bob)

	perms := []string{"perm1", "perm2"}
	for _, perm := range perms {
		rm.NewPermission(perm)
	}
	rm.AddPermissionToRole(ROLE_USER, "perm1")
	rm.AddPermissionToRole(ROLE_USER, "perm2")
	rm.AddRoleToUser(ROLE_USER, alice)
	rm.RemovePermissionFromRole(ROLE_USER, "perm1")
	if rm.HasPermission(alice, "perm1") {
		t.Errorf("HasPermission(alice, perm1) = %v, want %v", rm.HasPermission(alice, "perm1"), false)
	}
	if !rm.HasPermission(alice, "perm2") {
		t.Errorf("HasPermission(alice, perm2) = %v, want %v", rm.HasPermission(alice, "perm2"), true)
	}
}
