package daocond_test

import (
	"testing"

	"gno.land/p/demo/urequire"
	"gno.land/p/teritori/daocond"
)

func TestDaocond(t *testing.T) {
	// mock dao
	members := map[string][]string{
		"alice": []string{"finance-officer"},
		"bob":   []string{"public-relationships"},
		"eve":   []string{},
	}
	isMemberFn := func(memberId string) bool { _, ok := members[memberId]; return ok }
	membersCountFn := func() uint64 { return uint64(len(members)) }
	hasRoleFn := func(memberId string, role string) bool {
		roles, ok := members[memberId]
		if !ok {
			return false
		}
		for _, memberRole := range roles {
			if memberRole == role {
				return true
			}
		}
		return false
	}

	// leaf conditions
	membersMajority := daocond.MembersThreshold(0.6, isMemberFn, membersCountFn)
	publicRelationships := daocond.RoleCount(1, "public-relationships", hasRoleFn)
	financeOfficer := daocond.RoleCount(1, "finance-officer", hasRoleFn)

	urequire.Equal(t, "1 public-relationships", publicRelationships.Render())
	urequire.Equal(t, "60% of members", membersMajority.Render())
	urequire.Equal(t, "1 finance-officer", financeOfficer.Render())

	// ressource expressions
	ressources := map[string]daocond.Condition{}
	ressources["social.post"] = daocond.And(publicRelationships, membersMajority)
	ressources["finance.invest"] = daocond.Or(financeOfficer, membersMajority)

	urequire.Equal(t, "[1 public-relationships AND 60% of members]", ressources["social.post"].Render())
	urequire.Equal(t, "[1 finance-officer OR 60% of members]", ressources["finance.invest"].Render())

	// test cases
	runProposal := func(ressource string, testVotes map[string]daocond.Vote) daocond.State {
		resource, ok := ressources[ressource]
		urequire.True(t, ok)
		state := resource.NewState()

		ballots := map[string]daocond.Vote{}
		for memberId, vote := range testVotes {
			state.HandleVote(memberId, vote, ballots)
			ballots[memberId] = vote
		}

		return state
	}

	cases := []struct {
		name     string
		resource string
		votes    map[string]daocond.Vote
		result   bool
	}{
		{
			name:     "post with public-relationships",
			resource: "social.post",
			votes: map[string]daocond.Vote{
				"alice": "yes",
				"bob":   "yes",
				"eve":   "no",
			},
			result: true,
		},
		{
			name:     "post without public-relationships",
			resource: "social.post",
			votes: map[string]daocond.Vote{
				"alice": "yes",
				"bob":   "no",
				"eve":   "yes",
			},
			result: false,
		},
		{
			name:     "post public-relationships alone",
			resource: "social.post",
			votes: map[string]daocond.Vote{
				"alice": "no",
				"bob":   "yes",
				"eve":   "no",
			},
			result: false,
		},
		{
			name:     "invest with finance officer",
			resource: "finance.invest",
			votes: map[string]daocond.Vote{
				"alice": "yes",
				"bob":   "no",
				"eve":   "no",
			},
			result: true,
		},
		{
			name:     "invest without finance officer",
			resource: "finance.invest",
			votes: map[string]daocond.Vote{
				"alice": "no",
				"bob":   "yes",
				"eve":   "yes",
			},
			result: true,
		},
		{
			name:     "invest alone",
			resource: "finance.invest",
			votes: map[string]daocond.Vote{
				"alice": "no",
				"bob":   "no",
				"eve":   "yes",
			},
			result: false,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			state := runProposal(tc.resource, tc.votes)
			result := state.Eval()
			if tc.result != result {
				println("State:", state.RenderJSON())
			}
			urequire.Equal(t, tc.result, result)
		})
	}
}
