package daocond

import (
	"errors"
	"math"
	"strconv"
	"strings"

	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

var roleWeights = []float64{3.0, 2.0, 1.0}

func GovDaoCondThreshold(threshold float64, roles []string, hasRoleFn func(memberId string, role string) bool, usersWithRoleCountFn func(role string) uint32) Condition {
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
	usersWithRoleCountFn func(role string) uint32
}

func (m *govDaoCondThreshold) NewState() State {
	return &govDaoCondThresholdState{
		cond: m,
	}
}

func (m *govDaoCondThreshold) Render() string {
	rolePowers := []string{}
	for i, role := range m.roles {
		weight := strconv.FormatFloat(roleWeights[i], 'f', 2, 64) // ufmt.Sprintf("%.2f", ...) is not working
		rolePowers = append(rolePowers, ufmt.Sprintf("%s => %s power", role, weight))
	}
	return ufmt.Sprintf("%g%% of total voting power | %s", m.threshold*100, strings.Join(rolePowers, " | "))
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

func (m *govDaoCondThresholdState) Signal(votes map[string]Vote) float64 {
	return math.Min(m.yesRatio(votes)/m.cond.threshold, 1)
}

func (m *govDaoCondThresholdState) Eval(votes map[string]Vote) bool {
	return m.yesRatio(votes) >= m.cond.threshold
}

func (m *govDaoCondThresholdState) HandleEvent(_ Event, _ map[string]Vote) {
	panic(errors.New("not implemented"))
}

func (m *govDaoCondThresholdState) RenderJSON(votes map[string]Vote) *json.Node {
	vPowers, totalPower := m.computeVotingPowers()
	rolePowers := []string{}
	for _, role := range m.cond.roles {
		weight := strconv.FormatFloat(vPowers[role], 'f', 2, 64) // ufmt.Sprintf("%.2f", ...) is not working
		rolePowers = append(rolePowers, ufmt.Sprintf("%s => %s power", role, weight))
	}
	jsonData := json.ObjectNode("", map[string]*json.Node{
		"type":              json.StringNode("", "govdao-threshold"),
		"threshold":         json.NumberNode("", m.cond.threshold),
		"powerSplit":        json.StringNode("", strings.Join(rolePowers, " | ")),
		"totalYes":          json.NumberNode("", m.yesRatio(votes)),
		"votingPowerNeeded": json.NumberNode("", m.cond.threshold*totalPower),
		"totalVotingPower":  json.NumberNode("", totalPower),
	})
	return jsonData
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
	votingPowers := make(map[string]float64)
	totalPower := 0.0
	countsMembersPerRole := make(map[string]float64)

	for _, role := range m.cond.roles {
		countsMembersPerRole[role] = float64(m.cond.usersWithRoleCountFn(role))
	}

	for i, role := range m.cond.roles {
		if i == 0 {
			votingPowers[role] = roleWeights[0] // Highest tier always gets max power (3.0)
		} else {
			votingPowers[role] = computePower(countsMembersPerRole[m.cond.roles[0]], countsMembersPerRole[role], roleWeights[i])
		}
		totalPower += votingPowers[role] * countsMembersPerRole[role]
	}

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
