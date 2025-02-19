package daocond

import (
	"errors"
	"math"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func RoleCountFewVotes(count uint64, role string, hasRoleFn func(memberId string, role string) bool) Condition {
	if count == 0 {
		panic(errors.New("count must be greater than 0"))
	}
	if role == "" {
		panic(errors.New("role must not be empty"))
	}
	if hasRoleFn == nil {
		panic(errors.New("nil hasRoleFn"))
	}
	return &roleCountFewVotesCond{
		count:     count,
		hasRoleFn: hasRoleFn,
		role:      role,
	}
}

type roleCountFewVotesCond struct {
	hasRoleFn func(memberId string, role string) bool
	count     uint64
	role      string
}

// NewState implements Condition.
func (m *roleCountFewVotesCond) NewState() State {
	return &roleCountFewVotesState{
		cond: m,
	}
}

// Render implements Condition.
func (m *roleCountFewVotesCond) Render() string {
	return ufmt.Sprintf("%d %s", m.count, m.role)
}

// RenderJSON implements Condition.
func (m *roleCountFewVotesCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "role-count-few-votes"),
		"role":  json.StringNode("", m.role),
		"count": json.NumberNode("", float64(m.count)),
	})
}

var _ Condition = (*roleCountFewVotesCond)(nil)

type roleCountFewVotesState struct {
	cond *roleCountFewVotesCond
}

// Signal implements State.
func (m *roleCountFewVotesState) Signal(votes map[string]Vote) float64 {
	return math.Min(float64(m.totalYes(votes))/float64(m.cond.count), 1)
}

func (m *roleCountFewVotesState) totalYes(votes map[string]Vote) uint64 {
	totalYes := uint64(0)
	for userId, vote := range votes {
		if vote != VoteYes {
			continue
		}
		if !m.cond.hasRoleFn(userId, m.cond.role) {
			continue
		}
		totalYes += 1
	}
	return totalYes
}

// Eval implements State.
func (m *roleCountFewVotesState) Eval(votes map[string]Vote) bool {
	return m.totalYes(votes) >= m.cond.count
}

// HandleEvent implements State.
func (m *roleCountFewVotesState) HandleEvent(_ Event, _ map[string]Vote) {
	panic(errors.New("not implemented"))
}

// RenderJSON implements State.
func (m *roleCountFewVotesState) RenderJSON(votes map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "role-count-few-votes"),
		"totalYes": json.NumberNode("", float64(m.totalYes(votes))),
	})
}

var _ State = (*roleCountFewVotesState)(nil)
