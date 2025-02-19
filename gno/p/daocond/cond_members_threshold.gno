package daocond

import (
	"errors"
	"math"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func MembersThreshold(threshold float64, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	if threshold <= 0 || threshold > 1 {
		panic(errors.New("invalid threshold"))
	}
	if isMemberFn == nil {
		panic(errors.New("nil isMemberFn"))
	}
	if membersCountFn == nil {
		panic(errors.New("nil membersCountFn"))
	}
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

// Signal implements State.
func (m *membersThresholdState) Signal(votes map[string]Vote) float64 {
	return math.Min(m.yesRatio()/m.cond.threshold, 1)
}

func (m *membersThresholdState) yesRatio() float64 {
	return float64(m.totalYes) / float64(m.cond.membersCountFn())
}

// Eval implements State.
func (m *membersThresholdState) Eval(_ map[string]Vote) bool {
	return m.yesRatio() >= m.cond.threshold
}

// HandleEvent implements State.
func (m *membersThresholdState) HandleEvent(evt Event, votes map[string]Vote) {
	switch evt := evt.(type) {
	case *EventVote:
		if !m.cond.isMemberFn(evt.VoterID) {
			return
		}
		previousVote := votes[evt.VoterID]
		if previousVote == VoteYes && evt.Vote != VoteYes {
			m.totalYes -= 1
		} else if previousVote != VoteYes && evt.Vote == VoteYes {
			m.totalYes += 1
		}

	case *EventMemberAdded:
		if votes[evt.MemberID] == VoteYes {
			m.totalYes += 1
		}

	case *EventMemberRemoved:
		if votes[evt.MemberID] == VoteYes {
			m.totalYes -= 1
		}
	}
}

// RenderJSON implements State.
func (m *membersThresholdState) RenderJSON(_ map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "members-threshold"),
		"totalYes": json.NumberNode("", float64(m.totalYes)),
	})
}

var _ State = (*membersThresholdState)(nil)
