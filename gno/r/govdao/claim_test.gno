package govdao

import (
	"std"
	"testing"

	"gno.land/p/demo/testutils"
	"gno.land/p/demo/ufmt"
	"gno.land/p/demo/urequire"
	"gno.land/p/teritori/basedao"
)

var (
	addr1          = testutils.TestAddress("test1")
	someCaller     = testutils.TestAddress("callerx")
	nobodyVerified = func(string) string { return "" }
	allVerified    = func(login string) string { return addr1.String() }
)

func TestClaimTier(t *testing.T) {
	const ghHandle = "villaquiranm"
	type claimTest struct {
		panicError             string
		githubHandle           string
		seedContent            map[string]string
		getAddressByHandleFunc func(string) string
		caller                 std.Address
		alreadyMember          bool
		expectNewMember        bool
	}

	tests := map[string]claimTest{
		"handle is not present on seed": {
			panicError:   "user does not have a assigned tier",
			githubHandle: ghHandle,
			seedContent:  map[string]string{},
			caller:       someCaller,
		},
		"user is not yet verified": {
			panicError:   "user address is not yet verified",
			githubHandle: ghHandle,
			seedContent: map[string]string{
				ghHandle: "T1",
			},
			getAddressByHandleFunc: nobodyVerified,
			caller:                 someCaller,
		},
		"caller is not the claimer": {
			panicError:   "caller is should be the claimer",
			githubHandle: ghHandle,
			seedContent: map[string]string{
				ghHandle: "T1",
			},
			getAddressByHandleFunc: allVerified,
			caller:                 someCaller,
		},
		"caller is already member": {
			panicError:   "user already claimed his tier",
			githubHandle: ghHandle,
			seedContent: map[string]string{
				ghHandle: "T1",
			},
			getAddressByHandleFunc: allVerified,
			caller:                 addr1,
			alreadyMember:          true,
		},
		"OK": {
			panicError:   "",
			githubHandle: ghHandle,
			seedContent: map[string]string{
				ghHandle: "T1",
			},
			getAddressByHandleFunc: allVerified,
			caller:                 addr1,
			expectNewMember:        true,
		},
	}

	for tName, testData := range tests {
		t.Run(tName, func(t *testing.T) {
			defer func() {
				err := recover()
				if err != nil {
					ufmt.Println(err)
					errStr := err.(string)
					if testData.panicError != errStr {
						t.Error("expected error got nil")
					}
				}
			}()
			initialRoles := []string{"T1", "T2", "T3"}
			initialMembers := []basedao.Member{}

			if testData.alreadyMember {
				initialMembers = append(initialMembers, basedao.Member{Address: addr1.String(), Roles: []string{"T1"}})
			}

			dao = basedao.New(&basedao.Config{
				Name:              "GovDAO",
				Description:       "This is a GovDAO demo",
				NoDefaultHandlers: true,
				Members:           basedao.NewMembersStore(initialRoles, initialMembers),
				GetProfileString:  func(std.Address, string, string) string { return "" },
			})

			UserTiers = testData.seedContent
			getAddressByHandle = testData.getAddressByHandleFunc

			std.TestSetOrigCaller(testData.caller)

			ClaimTier(testData.githubHandle)

			if testData.expectNewMember {
				urequire.True(t, dao.Members.IsMember(testData.caller.String()))
			}
		})
	}
}
