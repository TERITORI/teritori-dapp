package daocond

import (
	"gno.land/p/demo/json"
)

// This model should work pretty good for small and dynamic daos.
// For daos with a lot of members and active proposals we might need to get rid of change events.

// base interfaces

type Condition interface {
	NewState() State

	Render() string
	RenderJSON() *json.Node
}

type State interface {
	Eval(votes map[string]Vote) bool
	HandleEvent(event Event, votes map[string]Vote)
	Signal(votes map[string]Vote) float64

	RenderJSON(votes map[string]Vote) *json.Node
}

type Vote string

const (
	VoteYes     = "yes"
	VoteNo      = "no"
	VoteAbstain = "abstain"
)

type Event interface {
}

// well known events

type EventVote struct {
	VoterID string
	Vote    Vote
}

type EventMemberAdded struct {
	MemberID string
}

type EventMemberRemoved struct {
	MemberID string
}

type EventRoleAssigned struct {
	UserID string
	Role   string
}

type EventRoleUnassigned struct {
	UserID string
	Role   string
}

type EventRoleRemoved struct {
	Role string
}
