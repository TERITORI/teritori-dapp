package daocond

import (
	"gno.land/p/demo/json"
	"gno.land/p/teritori/jsonutil"
)

// replace function with a map of functions
func ConditionFromJSON(conditionJSON string, hasRoleFn func(memberId string, role string) bool, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	nodes, err := json.Unmarshal([]byte(conditionJSON))
	if err != nil {
		panic("invalid condition json format")
	}
	return conditionFromJSON(nodes, hasRoleFn, isMemberFn, membersCountFn)
}

func conditionFromJSON(condition *json.Node, hasRoleFn func(memberId string, role string) bool, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	conditionObj := condition.MustObject()
	conditionType := conditionObj["type"].MustString()
	switch conditionType {
	case "AND":
		conditions := conditionObj["conditions"].MustArray()
		if len(conditions) == 0 {
			panic("AND condition must have 2 conditions")
		}
		return And(conditionFromJSON(conditions[0], hasRoleFn, isMemberFn, membersCountFn), conditionFromJSON(conditions[1], hasRoleFn, isMemberFn, membersCountFn))
	case "OR":
		conditions := conditionObj["conditions"].MustArray()
		if len(conditions) == 0 {
			panic("OR condition must have 2 conditions")
		}
		return Or(conditionFromJSON(conditions[0], hasRoleFn, isMemberFn, membersCountFn), conditionFromJSON(conditions[1], hasRoleFn, isMemberFn, membersCountFn))
	case "role-count":
		return RoleCount(uint64(jsonutil.MustInt64(conditionObj["count"])), conditionObj["role"].MustString(), hasRoleFn)
	case "members-threshold":
		return MembersThreshold(float64(jsonutil.MustInt64(conditionObj["threshold"]))/100, isMemberFn, membersCountFn)
	default:
		panic("unknown condition type")
	}
}
