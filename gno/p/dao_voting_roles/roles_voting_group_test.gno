package dao_voting_roles

import (
	"testing"

	"gno.land/p/demo/testutils"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/havl"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
)

func TestVotingRoles(t *testing.T) {
	rv := NewVotingRoles()
	var i dao_interfaces.IVotingModule
	i = rv

	{
		got := i.TotalPowerAtHeight("", havl.Latest)
		expected := uint64(0)
		if got != expected {
			t.Fatalf("expected %s, got %s.", expected, got)
		}
	}

	{
		conf := rv.ConfigJSON()
		expected := `{"totalPowers":{},"rolesPowers":{},"members":"0"}`
		if conf != expected {
			t.Fatalf("expected %s, got %s.", expected, conf)
		}
	}

	rv.SetMemberPower(alice, 1)

	{
		got := i.TotalPowerAtHeight("", havl.Latest)
		expected := uint64(1)
		if got != expected {
			t.Fatalf("expected %s, got %s.", expected, got)
		}
	}

	rv.NewRoleJSON("role1", `[
		{"resource": "resource1", "power": "2"}
	]`)
	rv.GrantRole(alice, "role1")

	{
		got := i.VotingPowerAtHeight(alice, "resource1", havl.Latest)
		expected := uint64(2)
		if got != expected {
			t.Fatalf("expected %s, got %s.", expected, got)
		}

		got = i.VotingPowerAtHeight(alice, "resource2", havl.Latest)
		expected = uint64(1)
		if got != expected {
			t.Fatalf("expected %s, got %s.", expected, got)
		}
	}

	{
		conf := rv.ConfigJSON()
		expected := `{"totalPowers":{"":"1"},"rolesPowers":{"role1":[{"resource":"resource1","power":"2"}]},"members":"1"}`
		if conf != expected {
			t.Fatalf("expected %s, got %s.", expected, conf)
		}
	}
}
