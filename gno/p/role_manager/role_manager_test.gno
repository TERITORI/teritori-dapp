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
}
