package daocond_test

import (
	"errors"
	"testing"

	"gno.land/p/demo/urequire"
	"gno.land/p/teritori/daocond"
)

func TestCondition(t *testing.T) {
	dao := newMockDAO(nil)

	// leaf conditions
	membersMajority := daocond.MembersThreshold(0.6, dao.isMember, dao.membersCount)
	publicRelationships := daocond.RoleCount(1, "public-relationships", dao.hasRole)
	financeOfficer := daocond.RoleCount(1, "finance-officer", dao.hasRole)

	urequire.Equal(t, "60% of members", membersMajority.Render())
	urequire.Equal(t, "1 public-relationships", publicRelationships.Render())
	urequire.Equal(t, "1 finance-officer", financeOfficer.Render())

	// ressource expressions
	ressources := map[string]daocond.Condition{
		"social.post":    daocond.And(publicRelationships, membersMajority),
		"finance.invest": daocond.Or(financeOfficer, membersMajority),
	}

	urequire.Equal(t, "[1 public-relationships AND 60% of members]", ressources["social.post"].Render())
	urequire.Equal(t, "[1 finance-officer OR 60% of members]", ressources["finance.invest"].Render())

}

func TestState(t *testing.T) {
	cases := []struct {
		name     string
		resource string
		phases   []testPhase
	}{
		{
			name:     "post with public-relationships",
			resource: "social.post",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "yes",
					"bob":   "yes",
					"eve":   "no",
				},
				result: true,
			}},
		},
		{
			name:     "post without public-relationships",
			resource: "social.post",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "yes",
					"bob":   "no",
					"eve":   "yes",
				},
				result: false,
			}},
		},
		{
			name:     "post after public-relationships removed",
			resource: "social.post",
			phases: []testPhase{
				{
					votes: map[string]daocond.Vote{
						"alice": "yes",
						"bob":   "yes",
						"eve":   "no",
					},
					result: true,
				},
				{
					changes: func(dao *mockDAO) {
						dao.unassignRole("bob", "public-relationships")
					},
					result: false,
				},
				{
					changes: func(dao *mockDAO) {
						dao.assignRole("alice", "public-relationships")
					},
					result: true,
				},
			},
		},
		{
			name:     "post public-relationships alone",
			resource: "social.post",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "no",
					"bob":   "yes",
					"eve":   "no",
				},
				result: false,
			}},
		},
		{
			name:     "invest with finance officer",
			resource: "finance.invest",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "yes",
					"bob":   "no",
					"eve":   "no",
				},
				result: true,
			}},
		},
		{
			name:     "invest without finance officer",
			resource: "finance.invest",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "no",
					"bob":   "yes",
					"eve":   "yes",
				},
				result: true,
			}},
		},
		{
			name:     "invest alone",
			resource: "finance.invest",
			phases: []testPhase{{
				votes: map[string]daocond.Vote{
					"alice": "no",
					"bob":   "no",
					"eve":   "yes",
				},
				result: false,
			}},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			var handleEvt func(evt daocond.Event)
			dao := newMockDAO(func(evt daocond.Event) { handleEvt(evt) })

			membersMajority := daocond.MembersThreshold(0.6, dao.isMember, dao.membersCount)
			publicRelationships := daocond.RoleCount(1, "public-relationships", dao.hasRole)
			financeOfficer := daocond.RoleCount(1, "finance-officer", dao.hasRole)
			ressources := map[string]daocond.Condition{
				"social.post":    daocond.And(publicRelationships, membersMajority),
				"finance.invest": daocond.Or(financeOfficer, membersMajority),
			}

			resource, ok := ressources[tc.resource]
			urequire.True(t, ok)

			state := resource.NewState()
			ballots := map[string]daocond.Vote{}
			handleEvt = func(evt daocond.Event) { state.HandleEvent(evt, ballots) }

			for _, phase := range tc.phases {
				if phase.changes != nil {
					phase.changes(dao)
				}
				if phase.votes != nil {
					for memberId, vote := range phase.votes {
						state.HandleEvent(&daocond.EventVote{VoterID: memberId, Vote: vote}, ballots)
						ballots[memberId] = vote
					}
				}
				result := state.Eval()
				if phase.result != result {
					println("State:", state.RenderJSON())
				}
				urequire.Equal(t, phase.result, result)
			}
		})
	}
}

type testPhase struct {
	changes func(dao *mockDAO)
	votes   map[string]daocond.Vote
	result  bool
}

type mockDAO struct {
	emitter func(evt daocond.Event)
	members map[string][]string
}

func newMockDAO(emitter func(evt daocond.Event)) *mockDAO {
	return &mockDAO{
		emitter: emitter,
		members: map[string][]string{
			"alice": []string{"finance-officer"},
			"bob":   []string{"public-relationships"},
			"eve":   []string{},
		},
	}
}

func (m *mockDAO) assignRole(userId string, role string) {
	if _, ok := m.members[userId]; !ok {
		panic(errors.New("unknown member"))
	}
	m.members[userId] = strsadd(m.members[userId], role)
	m.emitter(&daocond.EventRoleAssigned{UserID: userId, Role: role})
}

func (m *mockDAO) unassignRole(userId string, role string) {
	if _, ok := m.members[userId]; !ok {
		panic(errors.New("unknown member"))
	}
	m.members[userId] = strsrm(m.members[userId], role)
	m.emitter(&daocond.EventRoleUnassigned{UserID: userId, Role: role})
}

func (m *mockDAO) isMember(memberId string) bool {
	_, ok := m.members[memberId]
	return ok
}

func (m *mockDAO) membersCount() uint64 {
	return uint64(len(m.members))
}

func (m *mockDAO) hasRole(memberId string, role string) bool {
	roles, ok := m.members[memberId]
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

func strsrm(strs []string, val string) []string {
	res := []string{}
	for _, str := range strs {
		if str == val {
			continue
		}
		res = append(res, str)
	}
	return res
}

func strsadd(strs []string, val string) []string {
	for _, str := range strs {
		if str == val {
			return strs
		}
	}
	return append(strs, val)
}
