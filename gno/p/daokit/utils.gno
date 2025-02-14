package daokit

import (
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daocond"
)

func CreateCondition(conditionType string, dao **DAO, args ...interface{}) daocond.Condition {
	switch conditionType {
	case "AND", "OR":
		if len(args) != 2 {
			panic(ufmt.Sprintf("%s condition expects exactly 2 arguments", conditionType))
		}
		cond1, ok1 := args[0].(daocond.Condition)
		cond2, ok2 := args[1].(daocond.Condition)
		if !ok1 || !ok2 {
			panic(ufmt.Sprintf("%s condition expects two daocond.Condition arguments", conditionType))
		}
		if conditionType == "AND" {
			return daocond.And(cond1, cond2)
		} else {
			return daocond.Or(cond1, cond2)
		}
	case "role-count":
		if len(args) != 2 {
			panic("role-count condition expects exactly 2 arguments: (role string, count uint64)")
		}
		role, ok1 := args[0].(string)
		count, ok2 := args[1].(uint64)
		if !ok1 || !ok2 {
			panic("Invalid arguments for role-count condition: expected (role string, count uint64)")
		}
		return daocond.RoleCount(uint64(count), role, func(memberId string, role string) bool {
			return (*dao).MemberModule.HasRole(memberId, role)
		})
	case "role-treshold":
		if len(args) != 2 {
			panic("role-treshold condition expects exactly 2 arguments: (role string, threshold float64)")
		}
		role, ok1 := args[0].(string)
		threshold, ok2 := args[1].(float64)
		if !ok1 || !ok2 {
			panic("Invalid arguments for role-treshold condition: expected (role string, threshold float64)")
		}
		return daocond.RoleThreshold(threshold, role, func(memberId string, role string) bool {
			return (*dao).MemberModule.HasRole(memberId, role)
		}, func(role string) uint64 {
			return uint64((*dao).MemberModule.CountMembersWithRole(role))
		})
	case "members-treshold":
		if len(args) != 1 {
			panic("members-treshold condition expects exactly 1 argument: (threshold float64)")
		}
		threshold, ok := args[0].(float64)
		if !ok {
			panic("Invalid argument for members-treshold condition: expected (threshold float64)")
		}
		return daocond.MembersThreshold(threshold, func(memberId string) bool {
			return (*dao).MemberModule.IsMember(memberId)
		}, func() uint64 {
			return (*dao).MemberModule.MembersCount()
		})
	case "gov-dao":
		if len(args) != 1 {
			panic("gov-dao condition expects exactly 1 argument: (threshold float64)")
		}
		threshold, ok := args[0].(float64)
		if !ok {
			panic("Invalid argument for gov-dao condition: expected (threshold float64)")
		}
		return daocond.GovDaoCondThreshold(threshold, func(memberId string, role string) bool {
			return (*dao).MemberModule.HasRole(memberId, role)
		}, func(role string) uint64 {
			return uint64((*dao).MemberModule.CountMembersWithRole(role))
		})
	default:
		panic(ufmt.Sprintf("Unknown condition type: %s", conditionType))
	}
}
