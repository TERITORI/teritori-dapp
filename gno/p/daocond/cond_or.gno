package daocond

import (
	"gno.land/p/demo/json"
)

func Or(left Condition, right Condition) Condition {
	return &orCond{left: left, right: right}
}

type orCond struct {
	// XXX: use a slice instead of only two children?
	left  Condition
	right Condition
}

// NewState implements Expr.
func (a *orCond) NewState() State {
	return &orState{left: a.left.NewState(), right: a.right.NewState()}
}

// Render implements Expr.
func (a *orCond) Render() string {
	return "[" + a.left.Render() + " OR " + a.right.Render() + "]"
}

// RenderJSON implements Expr.
func (a *orCond) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "or"),
		"left":  a.left.RenderJSON(),
		"right": a.right.RenderJSON(),
	})
}

var _ Condition = (*andCond)(nil)

type orState struct {
	left  State
	right State
}

// Eval implements State.
func (a *orState) Eval() bool {
	return a.left.Eval() || a.right.Eval()
}

// HandleVote implements State.
func (a *orState) HandleVote(voterId string, vote Vote, previousVotes map[string]Vote) {
	a.left.HandleVote(voterId, vote, previousVotes)
	a.right.HandleVote(voterId, vote, previousVotes)
}

// RenderJSON implements State.
func (a *orState) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "and"),
		"left":  a.left.RenderJSON(),
		"right": a.right.RenderJSON(),
	})
}

var _ State = (*orState)(nil)
