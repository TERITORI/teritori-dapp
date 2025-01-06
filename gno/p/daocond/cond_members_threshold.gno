package daocond

import (
	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func MembersThreshold(threshold float64, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	return &membersThresholdCond{
		threshold:      threshold,
		isMemberFn:     isMemberFn,
		membersCountFn: membersCountFn,
	}
}

type membersThresholdCond struct {
	isMemberFn     func(memberId string) bool
	membersCountFn func() uint64
	threshold      float64
}

// NewState implements Condition.
func (m *membersThresholdCond) NewState() State {
	return &membersThresholdState{
		cond: m,
	}
}

// Render implements Condition.
func (m *membersThresholdCond) Render() string {
	return ufmt.Sprintf("%g%% of members", m.threshold*100)
}

// RenderJSON implements Condition.
func (m *membersThresholdCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":      json.StringNode("", "members-threshold"),
		"threshold": json.NumberNode("", m.threshold),
	})
}

var _ Condition = (*membersThresholdCond)(nil)

type membersThresholdState struct {
	cond     *membersThresholdCond
	totalYes uint64
}

// Eval implements State.
func (m *membersThresholdState) Eval() bool {
	return float64(m.totalYes)/float64(m.cond.membersCountFn()) >= m.cond.threshold
}

// HandleVote implements State.
func (m *membersThresholdState) HandleVote(voterId string, vote Vote, previousVotes map[string]Vote) {
	if !m.cond.isMemberFn(voterId) {
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

// RenderJSON implements Condition.
func (m *membersThresholdState) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "members-threshold"),
		"totalYes": json.NumberNode("", float64(m.totalYes)),
	})
}

var _ State = (*membersThresholdState)(nil)
