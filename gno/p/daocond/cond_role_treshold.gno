package daocond

import (
	"errors"
	"math"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func RoleThreshold(threshold float64, role string, hasRoleFn func(memberId string, role string) bool, usersRoleCountFn func(role string) uint32) Condition {
	if threshold <= 0 || threshold > 1 {
		panic(errors.New("invalid threshold"))
	}
	if hasRoleFn == nil {
		panic(errors.New("nil hasRoleFn"))
	}
	if usersRoleCountFn == nil {
		panic(errors.New("nil usersRoleCountFn"))
	}
	return &roleThresholdCond{
		threshold:        threshold,
		hasRoleFn:        hasRoleFn,
		usersRoleCountFn: usersRoleCountFn,
		role:             role,
	}
}

type roleThresholdCond struct {
	hasRoleFn        func(memberId string, role string) bool
	usersRoleCountFn func(role string) uint32
	threshold        float64
	role             string
}

// NewState implements Condition.
func (m *roleThresholdCond) NewState() State {
	return &roleThresholdState{
		cond: m,
	}
}

// Render implements Condition.
func (m *roleThresholdCond) Render() string {
	return ufmt.Sprintf("%g%% of %s members", m.threshold*100, m.role)
}

// RenderJSON implements Condition.
func (m *roleThresholdCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":      json.StringNode("", "role-threshold"),
		"role":      json.StringNode("", m.role),
		"threshold": json.NumberNode("", m.threshold),
	})
}

var _ Condition = (*roleThresholdCond)(nil)

type roleThresholdState struct {
	cond     *roleThresholdCond
	totalYes uint64
}

// Signal implements State.
func (m *roleThresholdState) Signal(votes map[string]Vote) float64 {
	return math.Min(m.yesRatio()/m.cond.threshold, 1)
}

func (m *roleThresholdState) yesRatio() float64 {
	return float64(m.totalYes) / float64(m.cond.usersRoleCountFn(m.cond.role))
}

// Eval implements State.
func (m *roleThresholdState) Eval(_ map[string]Vote) bool {
	return m.yesRatio() >= m.cond.threshold
}

// HandleEvent implements State.
func (m *roleThresholdState) HandleEvent(evt Event, votes map[string]Vote) {
	switch evt := evt.(type) {
	case *EventVote:
		if !m.cond.hasRoleFn(evt.VoterID, m.cond.role) {
			return
		}
		previousVote := votes[evt.VoterID]
		if previousVote == VoteYes && evt.Vote != VoteYes {
			m.totalYes -= 1
		} else if previousVote != VoteYes && evt.Vote == VoteYes {
			m.totalYes += 1
		}

	case *EventRoleAssigned:
		if evt.Role != m.cond.role {
			return
		}
		vote := votes[evt.UserID]
		if vote == VoteYes {
			m.totalYes += 1
		}

	case *EventRoleUnassigned:
		if evt.Role != m.cond.role {
			return
		}
		vote := votes[evt.UserID]
		if vote == VoteYes {
			m.totalYes -= 1
		}

	case *EventRoleRemoved:
		if evt.Role != m.cond.role {
			return
		}
		m.totalYes -= 1
	}
}

// RenderJSON implements State.
func (m *roleThresholdState) RenderJSON(_ map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":      json.StringNode("", "role-threshold"),
		"role":      json.StringNode("", m.cond.role),
		"threshold": json.NumberNode("", m.cond.threshold),
		"yes":       json.NumberNode("", float64(m.totalYes)),
		"total":     json.NumberNode("", float64(m.cond.usersRoleCountFn(m.cond.role))),
	})
}

var _ State = (*roleThresholdState)(nil)
