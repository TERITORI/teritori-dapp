package govdao

import (
	"std"
	"testing"

	"gno.land/p/demo/testutils"
	"gno.land/p/teritori/daokit"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
	carol = testutils.TestAddress("carol")
	dave  = testutils.TestAddress("dave")
	eve   = testutils.TestAddress("eve")
	frank = testutils.TestAddress("frank")
)

func TestDelegate(t *testing.T) {
	setupTest()

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
				if !dao.MemberModule.HasRole(test.input.target.String(), "T3") {
					t.Errorf("expected T3 role")
				}
			} else {
				if dao.MemberModule.HasRole(test.input.target.String(), "T3") {
					t.Errorf("unexpected T3 role")
				}
			}
		})
	}

}

func setupTest() {
	dao = &daokit.DAO{}
	name := "test"
	description := "test"

	roles := []string{"T1", "T2", "T3"}
	members := []daokit.Member{
		{Address: alice.String(), Roles: []string{"T1"}},
		{Address: bob.String(), Roles: []string{"T2"}},
		{Address: carol.String(), Roles: []string{"T1"}},
		{Address: frank.String(), Roles: []string{}}, // for testing purpose but should not happen (a role should be mandatory in govdao)
	}
	resources := []daokit.Resource{}
	dao = daokit.NewDAO(name, description, roles, members, resources, nil)
}
