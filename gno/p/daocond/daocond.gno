package daocond

import (
	"gno.land/p/demo/json"
)

type Vote string

const (
	VoteYes     = "yes"
	VoteNo      = "no"
	VoteAbstain = "abstain"
)

type Condition interface {
	NewState() State
	Render() string
	RenderJSON() *json.Node
}

type State interface {
	Eval() bool
	HandleVote(voterId string, vote Vote, previousVotes map[string]Vote)
	RenderJSON() *json.Node
}
