package dao_roles_voting_group

import (
	"testing"

	dao_interfaces "gno.land/p/teritori/dao_interfaces"
)

func TestRolesVotingGroup(t *testing.T) {
	rv := NewRolesVotingGroup()
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
}
