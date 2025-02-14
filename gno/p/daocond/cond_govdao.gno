package daocond

import (
	"errors"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

func GovDaoCondThreshold(threshold float64, roles []string, hasRoleFn func(memberId string, role string) bool, usersWithRoleCountFn func(role string) uint64) Condition {
	if threshold <= 0 || threshold > 1 {
		panic(errors.New("invalid threshold"))
	}
	if usersWithRoleCountFn == nil {
		panic(errors.New("nil usersWithRoleCountFn"))
	}
	if hasRoleFn == nil {
		panic(errors.New("nil hasRoleFn"))
	}
	if len(roles) > 3 {
		panic("the govdao condition handles at most 3 roles")
	}
	return &govDaoCondThreshold{
		threshold:            threshold,
		roles:                roles,
		hasRoleFn:            hasRoleFn,
		usersWithRoleCountFn: usersWithRoleCountFn,
	}
}

type govDaoCondThreshold struct {
	threshold            float64
	roles                []string
	hasRoleFn            func(memberId string, role string) bool
	usersWithRoleCountFn func(role string) uint64
}

func (m *govDaoCondThreshold) NewState() State {
	return &govDaoCondThresholdState{
		cond: m,
	}
}

// {threshold}% of {totalvotingpower} total voting power following these ({t1power} - T1, {t2power} T2, {t3power} T3)
func (m *govDaoCondThreshold) Render() string {
	return ufmt.Sprintf("%g%% of total voting power | T1 => 3.0 power | T2 => 2.0 power | T3 => 1.0 power", m.threshold*100)
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

func (m *govDaoCondThresholdState) Eval(votes map[string]Vote) bool {
	return m.yesRatio(votes) >= m.cond.threshold
}
func (m *govDaoCondThresholdState) HandleEvent(_ Event, _ map[string]Vote) {
	panic(errors.New("not implemented"))
}
func (m *govDaoCondThresholdState) RenderJSON(votes map[string]Vote) *json.Node {
	vPowers, totalPower := m.computeVotingPowers()
	return json.ObjectNode("", map[string]*json.Node{
		"type":              json.StringNode("", "govdao-threshold"),
		"treshold":          json.NumberNode("", m.cond.threshold),
		"tier1VotingPower":  json.NumberNode("", vPowers[m.cond.roles[0]]),
		"tier2VotingPower":  json.NumberNode("", vPowers[m.cond.roles[1]]),
		"tier3VotingPower":  json.NumberNode("", vPowers[m.cond.roles[2]]),
		"totalYes":          json.NumberNode("", m.yesRatio(votes)),
		"votingPowerNeeded": json.NumberNode("", m.cond.threshold*totalPower),
		"totalVotingPower":  json.NumberNode("", totalPower),
	})
}

var _ State = (*govDaoCondThresholdState)(nil)

func (m *govDaoCondThresholdState) yesRatio(votes map[string]Vote) float64 {
	var totalYes float64
	votingPowersByTier, totalPower := m.computeVotingPowers()
	// Case when there are zero T1s
	if totalPower == 0.0 {
		return totalPower
	}

	for userID, vote := range votes {
		if vote != VoteYes {
			continue
		}
		tier := m.getUserRole(userID)

		totalYes += votingPowersByTier[tier]
	}
	return totalYes / totalPower
}

func (m *govDaoCondThresholdState) getUserRole(userID string) string {
	for _, role := range m.cond.roles {
		if m.cond.hasRoleFn(userID, role) {
			return role
		}
	}
	panic("No role found for user")
}

func (m *govDaoCondThresholdState) computeVotingPowers() (map[string]float64, float64) {
	roles := m.cond.roles
	totalT1s := float64(m.cond.usersWithRoleCountFn(roles[0]))
	totalT2s := float64(m.cond.usersWithRoleCountFn(roles[1]))
	totalT3s := float64(m.cond.usersWithRoleCountFn(roles[2]))
	votingPowers := map[string]float64{
		roles[0]: 3.0,
		roles[1]: computePower(totalT1s, totalT2s, 2.0),
		roles[2]: computePower(totalT1s, totalT3s, 1.0),
	}

	totalPower := votingPowers[roles[0]]*totalT1s + votingPowers[roles[1]]*totalT2s + votingPowers[roles[2]]*totalT3s

	return votingPowers, totalPower
}

// max power here is the number of votes each tier gets when we have
// the same number of member on each tier
// T2 = 2.0 and T1 = 1.0 with the ration T1/Tn
// we compute the actual ratio
func computePower(T1, Tn, maxPower float64) float64 {
	// If there are 0 Tn (T2, T3) just return the max power
	// we could also return 0.0 as voting power
	if Tn <= 0.0 {
		return maxPower
	}

	computedPower := (T1 / Tn) * maxPower
	if computedPower >= maxPower {
		// If computed power is bigger than the max, this happens if Tn is lower than T1
		// cap the max power to max power.
		return maxPower
	}
	return computedPower
}
