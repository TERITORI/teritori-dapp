package daocond

import (
	"gno.land/p/demo/json"
	"gno.land/p/teritori/jsonutil"
)

func ConditionFromJSON(condition *json.Node, hasRoleFn func(memberId string, role string) bool, isMemberFn func(memberId string) bool, membersCountFn func() uint64) Condition {
	conditionObj := condition.MustObject()
	conditionType := conditionObj["type"].MustString()
	switch conditionType {
	case "AND":
		conditions := conditionObj["conditions"].MustArray()
		if len(conditions) == 0 {
			panic("AND condition must have 2 conditions")
		}
		return And(ConditionFromJSON(conditions[0], hasRoleFn, isMemberFn, membersCountFn), ConditionFromJSON(conditions[1], hasRoleFn, isMemberFn, membersCountFn))
	case "OR":
		conditions := conditionObj["conditions"].MustArray()
		if len(conditions) == 0 {
			panic("OR condition must have 2 conditions")
		}
		return Or(ConditionFromJSON(conditions[0], hasRoleFn, isMemberFn, membersCountFn), ConditionFromJSON(conditions[1], hasRoleFn, isMemberFn, membersCountFn))
	case "role-count":
		return RoleCount(uint64(jsonutil.MustInt64(conditionObj["count"])), conditionObj["role"].MustString(), hasRoleFn)
	case "members-threshold":
		return MembersThreshold(float64(jsonutil.MustInt64(conditionObj["threshold"]))/100, isMemberFn, membersCountFn)
	default:
		panic("unknown condition type")
	}
}
