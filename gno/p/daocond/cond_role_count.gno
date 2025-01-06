package daocond

import (
	"errors"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func RoleCount(count uint64, role string, hasRoleFn func(memberId string, role string) bool) Condition {
	if count == 0 {
		panic(errors.New("count must be greater than 0"))
	}
	if role == "" {
		panic(errors.New("role must not be empty"))
	}
	return &roleCountCond{
		count:     count,
		hasRoleFn: hasRoleFn,
		role:      role,
	}
}

type roleCountCond struct {
	hasRoleFn func(memberId string, role string) bool
	count     uint64
	role      string
}

// NewState implements Condition.
func (m *roleCountCond) NewState() State {
	return &roleCountState{
		cond: m,
	}
}

// Render implements Condition.
func (m *roleCountCond) Render() string {
	return ufmt.Sprintf("%d %s", m.count, m.role)
}

// RenderJSON implements Condition.
func (m *roleCountCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "role-count"),
		"role":  json.StringNode("", m.role),
		"count": json.NumberNode("", float64(m.count)),
	})
}

var _ Condition = (*roleCountCond)(nil)

type roleCountState struct {
	cond     *roleCountCond
	totalYes uint64
}

// Eval implements State.
func (m *roleCountState) Eval() bool {
	return m.totalYes >= m.cond.count
}

// HandleVote implements State.
func (m *roleCountState) HandleVote(voterId string, vote Vote, previousVotes map[string]Vote) {
	if !m.cond.hasRoleFn(voterId, m.cond.role) {
		return
	}
	previousVote, ok := previousVotes[voterId]
	if !ok {
		if vote == VoteYes {
			m.totalYes += 1
		}
		return
	}
	if previousVote == VoteYes && vote != VoteYes {
		m.totalYes -= 1
	}
	if previousVote != VoteYes && vote == VoteYes {
		m.totalYes += 1
	}
}

// RenderJSON implements State.
func (m *roleCountState) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "role-count"),
		"totalYes": json.NumberNode("", float64(m.totalYes)),
	})
}

var _ State = (*roleCountState)(nil)
