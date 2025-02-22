package daocond

import (
	"math"

	"gno.land/p/demo/json"
)

func And(left Condition, right Condition) Condition {
	if left == nil || right == nil {
		panic("left or right is nil")
	}
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

// Signal implements State.
func (a *andState) Signal(votes map[string]Vote) float64 {
	return math.Min(a.left.Signal(votes), a.right.Signal(votes))
}

// RenderJSON implements State.
func (a *andState) RenderJSON(votes map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":  json.StringNode("", "and"),
		"left":  a.left.RenderJSON(votes),
		"right": a.right.RenderJSON(votes),
	})
}

// Eval implements State.
func (a *andState) Eval(votes map[string]Vote) bool {
	return a.left.Eval(votes) && a.right.Eval(votes)
}

// HandleEvent implements State.
func (a *andState) HandleEvent(evt Event, votes map[string]Vote) {
	a.left.HandleEvent(evt, votes)
	a.right.HandleEvent(evt, votes)
}

var _ State = (*andState)(nil)
