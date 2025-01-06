package daocond

import (
	"gno.land/p/demo/json"
)

func And(left Condition, right Condition) Condition {
	return &andCond{left: left, right: right}
}

type andCond struct {
	// XXX: use a slice instead of only two children?
	left  Condition
	right Condition
}

// NewState implements Condition.
func (a *andCond) NewState() State {
	return &andState{left: a.left.NewState(), right: a.right.NewState()}
}

// Render implements Condition.
func (a *andCond) Render() string {
	return "[" + a.left.Render() + " AND " + a.right.Render() + "]"
}

// RenderJSON implements Condition.
func (a *andCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "and"),
		"left":  a.left.RenderJSON(),
		"right": a.right.RenderJSON(),
	})
}

var _ Condition = (*andCond)(nil)

type andState struct {
	left  State
	right State
}

// RenderJSON implements State.
func (a *andState) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "and"),
		"left":  a.left.RenderJSON(),
		"right": a.right.RenderJSON(),
	})
}

// Eval implements State.
func (a *andState) Eval() bool {
	return a.left.Eval() && a.right.Eval()
}

// HandleVote implements State.
func (a *andState) HandleVote(voterId string, vote Vote, previousVotes map[string]Vote) {
	a.left.HandleVote(voterId, vote, previousVotes)
	a.right.HandleVote(voterId, vote, previousVotes)
}

var _ State = (*andState)(nil)
