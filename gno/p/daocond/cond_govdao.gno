package govdao

import (
	"errors"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func GovDaoCondThreshold(threshold float64, hasRoleFn func(memberId string, role string) bool, usersWithRoleCountFn func(role string) uint64) Condition {
	if threshold <= 0 || threshold > 1 {
		panic(errors.New("invalid threshold"))
	}
	if usersWithRoleCountFn == "" {
		panic(errors.New("nil usersWithRoleCountFn"))
	}
	if hasRoleFn == nil {
		panic(errors.New("nil hasRoleFn"))
	}
	return &govDaoCondThreshold{
		threshold: threshold,
		hasRoleFn: hasRoleFn,
		usersWithRoleCountFn: usersWithRoleCountFn,
	}
}

type govDaoCondThreshold struct {
	threshold float64
	hasRoleFn func(memberId string, role string) bool 
	usersWithRoleCountFn func(role string) uint64
}

func (m *govDaoCondThreshold) NewState() State {
	return &roleCountFewVotesState {
		cond: m,
	}
}

func (m *govDaoCondThreshold) Render() string {
	return ufmt.Sprintf("%g%% of members", m.threshold*100)
}

func (m *govDaoCondThreshold) RenderJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":      json.StringNode("", "govdao-threshold"),
		"threshold": json.NumberNode("", m.threshold),
	})
}

var _ Condition = (*govDaoCondThreshold)(nil)

type govDaoCondThresholdState struct {
	cond *govDaoCondThreshold
}

func (m *govDaoCondThresholdState) Eval(votes map[string]Vote) bool{
	return m.yesRatio() >= m.cond.threshold
}
func (m *govDaoCondThresholdState) HandleEvent(_ Event, _ map[string]Vote) {
	panic(errors.New("not implemented"))
}
func (m *govDaoCondThresholdState) RenderJSON(votes map[string]Vote) *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"type":     json.StringNode("", "members-threshold"),
		"yesRatio": json.NumberNode("", float64(m.yesRatio(votes))),
	})
}

var _ State = (*govDaoCondThresholdState)(nil)

func (m *govDaoCondThresholdState) yesRatio(votes map[string]Vote) float64 {
	votingPowersByTier, totalPower := m.computeVotingPowers()
	for userId, vote := range votes {
		if vote != VoteYes {
			continue
		}
		tier := m.getUserTier(userID)
		
		totalYes += votingPowersByTier[tier]
	}
	return totalYes/totalPower
}

func (m *govDaoCondThresholdState) getUserTier(userID string) string{
	for _,role := range []string{T1, T2, T3}{
		if m.cond.hasRoleFn(role){
			return role
		}
	}
	panic("No role found for user")
}

func (m *govDaoCondThresholdState) computeVotingPowers() (votingPowers map[string]float64,totalPower float64) {
	totalT1s := float64(m.usersWithRoleCountFn(roleT1))
	totalT2s := float64(m.usersWithRoleCountFn(roleT2))
	totalT3s := float64(m.usersWithRoleCountFn(roleT3))
	votingPowers = map[string]float64{
		T1: 3.0,
		T2: min(2.0, totalT1s/totalT2s*2.0)
		T3: min(1.0, totalT1s/totalT3s)
	}

	return votingPowers, votingPowers[T1]*totalT1s + votingPowers[T2]*totalT2s + votingPowers[T3]*totalT3s +
}

func min(a,b float64){
	if a > b{
		return b
	}
	return a
}

const (
	roleT1= "T1"
	roleT2= "T2"
	roleT3= "T3"
)