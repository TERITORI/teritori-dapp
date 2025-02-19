package daocond

import (
	"errors"
	"math"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func MembersThresholdFewVotes(threshold float64, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	if threshold <= 0 || threshold > 1 {
		panic(errors.New("invalid threshold"))
	}
	if isMemberFn == nil {
		panic(errors.New("nil isMemberFn"))
	}
	if membersCountFn == nil {
		panic(errors.New("nil membersCountFn"))
	}
	return &membersThresholdFewVotesCond{
		threshold:      threshold,
		isMemberFn:     isMemberFn,
		membersCountFn: membersCountFn,
	}
}

type membersThresholdFewVotesCond struct {
	isMemberFn     func(memberId string) bool
	membersCountFn func() uint64
	threshold      float64
}

// NewState implements Condition.
func (m *membersThresholdFewVotesCond) NewState() State {
	return &membersThresholdFewVotesState{
		cond: m,
	}
}

// Render implements Condition.
func (m *membersThresholdFewVotesCond) Render() string {
	return ufmt.Sprintf("%g%% of members", m.threshold*100)
}

// RenderJSON implements Condition.
func (m *membersThresholdFewVotesCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":      json.StringNode("", "members-threshold"),
		"threshold": json.NumberNode("", m.threshold),
	})
}

var _ Condition = (*membersThresholdFewVotesCond)(nil)

type membersThresholdFewVotesState struct {
	cond *membersThresholdFewVotesCond
}

// Signal implements State.
func (m *membersThresholdFewVotesState) Signal(votes map[string]Vote) float64 {
	return math.Min(m.yesRatio(votes)/m.cond.threshold, 1)
}

func (m *membersThresholdFewVotesState) totalYes(votes map[string]Vote) uint64 {
	totalYes := uint64(0)
	for userId, vote := range votes {
		if vote != VoteYes {
			continue
		}
		if !m.cond.isMemberFn(userId) {
			continue
		}
		totalYes += 1
	}
	return totalYes
}

func (m *membersThresholdFewVotesState) yesRatio(votes map[string]Vote) float64 {
	return float64(m.totalYes(votes)) / float64(m.cond.membersCountFn())
}

// Eval implements State.
func (m *membersThresholdFewVotesState) Eval(votes map[string]Vote) bool {
	return m.yesRatio(votes) >= m.cond.threshold
}

// HandleEvent implements State.
func (m *membersThresholdFewVotesState) HandleEvent(_ Event, _ map[string]Vote) {
	panic(errors.New("not implemented"))
}

// RenderJSON implements State.
func (m *membersThresholdFewVotesState) RenderJSON(votes map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "members-threshold"),
		"totalYes": json.NumberNode("", float64(m.totalYes(votes))),
	})
}

var _ State = (*membersThresholdFewVotesState)(nil)
