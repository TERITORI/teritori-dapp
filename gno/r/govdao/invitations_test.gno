package govdao

import (
	"std"
	"testing"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/testutils"
	"gno.land/p/teritori/basedao"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/daokit"
	"gno.land/p/teritori/role_manager"
	"gno.land/r/demo/profile"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
	carol = testutils.TestAddress("carol")
	dave  = testutils.TestAddress("dave")
	eve   = testutils.TestAddress("eve")
	frank = testutils.TestAddress("frank")
	greg  = testutils.TestAddress("greg")

	names = map[std.Address]string{
		alice: "alice",
		bob:   "bob",
		carol: "carol",
		dave:  "dave",
		eve:   "eve",
		frank: "frank",
		greg:  "greg",
	}
)

func TestDelegate(t *testing.T) {
	setupTest() // reset dao & invitations trees

	type testDelegateInput struct {
		caller std.Address
		target std.Address
	}

	type testDelegateExpected struct {
		panic bool
		t3    bool
	}

	type testDelegate struct {
		input    testDelegateInput
		expected testDelegateExpected
	}

	type testDelegateTestTable = map[string]testDelegate

	tests := testDelegateTestTable{
		"Delegate to himself": {
			input: testDelegateInput{
				caller: alice,
				target: alice,
			},
			expected: testDelegateExpected{
				panic: true,
			},
		},
		"Not a member": {
			input: testDelegateInput{
				caller: eve,
				target: dave,
			},
			expected: testDelegateExpected{
				panic: true,
			},
		},
		"Success": {
			input: testDelegateInput{
				caller: alice,
				target: dave,
			},
			expected: testDelegateExpected{
				panic: false,
				t3:    false, // need 2 invitations to become a member
			},
		},
		"Already delegated": {
			input: testDelegateInput{
				caller: alice,
				target: dave,
			},
			expected: testDelegateExpected{
				panic: true,
			},
		},
		"No roles": {
			input: testDelegateInput{
				caller: frank,
				target: dave,
			},
			expected: testDelegateExpected{
				panic: true,
			},
		},
		"Succes 2nd invitation": {
			input: testDelegateInput{
				caller: bob,
				target: dave,
			},
			expected: testDelegateExpected{
				panic: false,
				t3:    true, // now dave is a T3 member
			},
		},
		"New member invitation": {
			input: testDelegateInput{
				caller: dave,
				target: alice,
			},
			expected: testDelegateExpected{
				panic: false,
				t3:    false,
			},
		},
		"Maximum invitations": {
			input: testDelegateInput{
				caller: dave, // already sent 1 invitation (T3 member)
				target: eve,
			},
			expected: testDelegateExpected{
				panic: true,
			},
		},
		"Delegate to a tiered-members": {
			input: testDelegateInput{
				caller: carol,
				target: alice,
			},
			expected: testDelegateExpected{
				panic: false,
				t3:    false, // alice is already a T1 member
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("expected panic")
					}
				}()
			}

			std.TestSetOrigCaller(test.input.caller)
			Delegate(test.input.target.String())
			if test.expected.t3 {
				if !dao.Members.HasRole(test.input.target.String(), "T3") {
					t.Errorf("expected T3 role: %s", names[test.input.target])
				}
			} else {
				if dao.Members.HasRole(test.input.target.String(), "T3") {
					t.Errorf("unexpected T3 role: %s", names[test.input.target])
				}
			}
		})
	}

}

func TestWithdraw(t *testing.T) {
	setupTest() // reset dao & invitations trees

	std.TestSetOrigCaller(alice)
	Delegate(dave.String())
	Delegate(eve.String())
	Delegate(greg.String())
	std.TestSetOrigCaller(bob)
	Delegate(dave.String())
	std.TestSetOrigCaller(carol)
	Delegate(alice.String())
	Delegate(dave.String())
	std.TestSetOrigCaller(dave)
	Delegate(eve.String())
	std.TestSetOrigCaller(eve)
	Delegate(greg.String())

	type testWithdrawInput struct {
		caller std.Address
		target std.Address
	}

	type testWithdrawExpected struct {
		panic         bool
		t3            bool
		chainWithdraw []std.Address
	}

	type testWithdraw struct {
		input    testWithdrawInput
		expected testWithdrawExpected
	}

	type testWithdrawTestTable = map[string]testWithdraw

	tests := testWithdrawTestTable{
		"Caller not a member": {
			input: testWithdrawInput{
				caller: eve,
				target: dave,
			},
			expected: testWithdrawExpected{
				panic: true,
			},
		},
		"No invitation": {
			input: testWithdrawInput{
				caller: alice,
				target: bob,
			},
			expected: testWithdrawExpected{
				panic: true,
			},
		},
		"Unknown role": {
			input: testWithdrawInput{
				caller: frank,
				target: dave,
			},
			expected: testWithdrawExpected{
				panic: true,
			},
		},
		"Success": {
			input: testWithdrawInput{
				caller: carol,
				target: dave,
			},
			expected: testWithdrawExpected{
				panic: false,
				t3:    true,
			},
		},
		"2nd Success": {
			input: testWithdrawInput{
				caller: alice,
				target: dave,
			},
			expected: testWithdrawExpected{
				panic: false,
				t3:    false,
				chainWithdraw: []std.Address{
					eve,
					greg,
				},
			},
		},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			if test.expected.panic {
				defer func() {
					if r := recover(); r == nil {
						t.Errorf("expected panic")
					}
				}()
			}

			std.TestSetOrigCaller(test.input.caller)
			Withdraw(test.input.target.String())
			if test.expected.t3 {
				if !dao.Members.HasRole(test.input.target.String(), "T3") {
					t.Errorf("expected T3 role: %s", names[test.input.target])
				}
			} else {
				if dao.Members.HasRole(test.input.target.String(), "T3") {
					t.Errorf("unexpected T3 role: %s", names[test.input.target])
				}

				for _, addr := range test.expected.chainWithdraw {
					if dao.Members.HasRole(addr.String(), "T3") {
						t.Errorf("unexpected T3 role: %s", names[addr])
					}
				}
			}
		})
	}

}

func setupTest() {
	roles := []role_manager.RoleInfo{
		{Name: Tier1, Description: "Self-selecting \"core\" with supermajority vote from T1. A T1 member gets 3 votes."},
		{Name: Tier2, Description: "Selected by GovDAO w/ T3 abstaining, with simple majority vote. A T2 member gets 2 votes."},
		{Name: Tier3, Description: "Permissionless invitation from T1 and T2. A T3 member gets 1 vote."},
	}
	members := []basedao.Member{
		{Address: alice.String(), Roles: []string{"T1"}},
		{Address: bob.String(), Roles: []string{"T2"}},
		{Address: carol.String(), Roles: []string{"T1"}},
		{Address: frank.String(), Roles: []string{}}, // for testing purpose but should not happen (a role should be mandatory in govdao)
	}

	dao = basedao.New(&basedao.Config{
		Name:              "test",
		Description:       "test",
		Members:           basedao.NewMembersStore(roles, members),
		GetProfileString:  profile.GetStringField,
		SetProfileString:  profile.SetStringField,
		NoDefaultHandlers: true,
	})

	t1Supermajority := daocond.RoleThreshold(0.66, Tier1, dao.Members.HasRole, dao.Members.CountMembersWithRole)
	supermajority := daocond.GovDaoCondThreshold(0.66, []string{Tier1, Tier2, Tier3}, dao.Members.HasRole, dao.Members.CountMembersWithRole)
	majorityWithoutT3 := daocond.GovDaoCondThreshold(0.5, []string{Tier1, Tier2}, dao.Members.HasRole, dao.Members.CountMembersWithRole)

	resources := []*daokit.Resource{
		{
			Handler:   NewAddT1MemberHandler(dao),
			Condition: t1Supermajority,
		},
		{
			Handler:   NewAddT2MemberHandler(dao),
			Condition: majorityWithoutT3,
		},
		{
			Handler:   basedao.NewEditProfileHandler(profile.SetStringField, nil),
			Condition: supermajority,
		},
	}
	for _, r := range resources {
		dao.Core.SetResource(r)
	}

	invitationsSentTree = avl.NewTree()
	invitationsReceivedTree = avl.NewTree()
}
