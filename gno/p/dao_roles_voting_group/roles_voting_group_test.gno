package dao_roles_voting_group

import (
	"testing"

	"gno.land/p/demo/testutils"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/dao_roles_group"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
)

func TestRolesVotingGroup(t *testing.T) {
	rm := dao_roles_group.NewRolesGroup()
	rv := NewRolesVotingGroup(rm)
	var i dao_interfaces.IVotingModule
	i = rv

	{
		got := i.TotalPowerAtHeight(0)
		expected := uint64(0)
		if got != expected {
			t.Fatalf("expected %s, got %s.", expected, got)
		}
	}

	{
		conf := rv.ConfigJSON()
		expected := `{"totalPower":"0","members":"0"}`
		if conf != expected {
			t.Fatalf("expected %s, got %s.", expected, conf)
		}
	}

	// rv.SetMemberPower(alice, 1)

	// {
	// 	got := i.TotalPowerAtHeight(0)
	// 	expected := uint64(1)
	// 	if got != expected {
	// 		t.Fatalf("expected %s, got %s.", expected, got)
	// 	}
	// }

	// rm.NewRoleJSON("role1", `[
	// 	{"resource": "resource1", "power": 2}
	// ]`)
	// rm.GrantRole(alice, "role1")

	// {
	// 	got := i.VotingPowerAtHeight(alice, 0, []string{"resource1"})
	// 	expected := uint64(2)
	// 	if got != expected {
	// 		t.Fatalf("expected %s, got %s.", expected, got)
	// 	}

	// 	got = i.VotingPowerAtHeight(alice, 0, []string{"resource2"})
	// 	expected = uint64(0)
	// 	if got != expected {
	// 		t.Fatalf("expected %s, got %s.", expected, got)
	// 	}
	// }
}
