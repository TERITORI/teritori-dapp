package daocond

import (
	"math"

	"gno.land/p/demo/json"
)

func Or(left Condition, right Condition) Condition {
	if left == nil || right == nil {
		panic("left or right is nil")
	}
	return &orCond{left: left, right: right}
}

type orCond struct {
	// XXX: use a slice instead of only two children?
	left  Condition
	right Condition
}

// NewState implements Condition.
func (a *orCond) NewState() State {
	return &orState{left: a.left.NewState(), right: a.right.NewState()}
}

// Render implements Condition.
func (a *orCond) Render() string {
	return "[" + a.left.Render() + " OR " + a.right.Render() + "]"
}

// RenderJSON implements Condition.
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

// Signal implements State.
func (a *orState) Signal(votes map[string]Vote) float64 {
	return math.Max(a.left.Signal(votes), a.right.Signal(votes))
}

// Eval implements State.
func (a *orState) Eval(votes map[string]Vote) bool {
	return a.left.Eval(votes) || a.right.Eval(votes)
}

// HandleEvent implements State.
func (a *orState) HandleEvent(evt Event, votes map[string]Vote) {
	a.left.HandleEvent(evt, votes)
	a.right.HandleEvent(evt, votes)
}

// RenderJSON implements State.
func (a *orState) RenderJSON(votes map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "and"),
		"left":  a.left.RenderJSON(votes),
		"right": a.right.RenderJSON(votes),
	})
}

var _ State = (*orState)(nil)
