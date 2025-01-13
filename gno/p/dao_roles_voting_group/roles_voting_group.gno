package dao_roles_voting_group

import (
	"std"
	"strconv"
	"strings"

	"gno.land/p/demo/json"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/dao_roles_group"
	"gno.land/p/teritori/havl"
	"gno.land/p/teritori/jsonutil"
)

type Member struct {
	Address std.Address
	Power   uint64
}

func (m Member) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"address": jsonutil.AddressNode(m.Address),
		"power":   jsonutil.Uint64Node(m.Power),
	})
}

func (m *Member) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	m.Address = jsonutil.MustAddress(obj["address"])
	m.Power = jsonutil.MustUint64(obj["power"])
}

type RolesVotingGroup struct {
	powerByAddr *havl.Tree // std.Address -> uint64
	totalPower  *havl.Tree // "" -> uint64
	memberCount *havl.Tree // "" -> uint32
	rolesModule *dao_roles_group.RolesGroup
}

var _ dao_interfaces.IVotingModule = (*RolesVotingGroup)(nil)

func NewRolesVotingGroup(rm *dao_roles_group.RolesGroup) *RolesVotingGroup {
	return &RolesVotingGroup{
		powerByAddr: havl.NewTree(),
		totalPower:  havl.NewTree(),
		memberCount: havl.NewTree(),
		rolesModule: rm,
	}
}

func (v *RolesVotingGroup) Info() dao_interfaces.ModuleInfo {
	return dao_interfaces.ModuleInfo{
		Kind:    "gno.land/p/teritori/dao_roles_voting_group",
		Version: "0.1.0",
	}
}

func (v *RolesVotingGroup) ConfigJSON() string {
	return json.ObjectNode("", map[string]*json.Node{
		"totalPower": jsonutil.Uint64Node(v.TotalPowerAtHeight(havl.Latest)),
		"members":    jsonutil.Uint32Node(v.MemberCount(havl.Latest)),
	}).String()
}

func (v *RolesVotingGroup) GetMembersJSON(start, end string, limit uint64, height int64) string {
	members := v.GetMembers(start, end, limit, height)
	membersJSON := make([]*json.Node, len(members))
	for i, m := range members {
		membersJSON[i] = m.ToJSON()
	}
	return json.ArrayNode("", membersJSON).String()
}

func (v *RolesVotingGroup) VotingPowerAtHeight(addr std.Address, height int64, resources []string) uint64 {
	userPower, ok := v.powerByAddr.Get(addr.String(), height)
	if !ok {
		return 0
	}

	// In case there is many resources involved, we take the lowest value
	rolePower := uint64(0)
	for _, resource := range resources {
		tmp := v.rolesModule.GetMemberResourceVPower(addr, resource)
		if tmp < rolePower || rolePower == 0 {
			rolePower = tmp
		}
	}

	if rolePower > userPower.(uint64) {
		return rolePower
	}

	return userPower.(uint64)
}

func (v *RolesVotingGroup) TotalPowerAtHeight(height int64) uint64 {
	p, ok := v.totalPower.Get("", height)
	if !ok {
		return 0
	}

	return p.(uint64)
}

func (g *RolesVotingGroup) SetMemberPower(addr std.Address, power uint64) {
	if power == 0 {
		g.RemoveMember(addr)
		return
	}

	iprevious, ok := g.powerByAddr.Get(addr.String(), havl.Latest)
	if !ok {
		g.memberCount.Set("", g.MemberCount(havl.Latest)+1)
	}

	previous := uint64(0)
	if ok {
		previous = iprevious.(uint64)
	}

	if power == previous {
		return
	}

	g.powerByAddr.Set(addr.String(), power)

	ipreviousTotal, ok := g.totalPower.Get("", havl.Latest)
	previousTotal := uint64(0)
	if ok {
		previousTotal = ipreviousTotal.(uint64)
	}

	g.totalPower.Set("", (previousTotal+power)-previous)
}

func (g *RolesVotingGroup) RemoveMember(addr std.Address) (uint64, bool) {
	p, removed := g.powerByAddr.Remove(addr.String())
	if !removed {
		return 0, false
	}

	g.memberCount.Set("", g.MemberCount(havl.Latest)-1)
	power := p.(uint64)
	g.totalPower.Set("", g.TotalPowerAtHeight(havl.Latest)-power)
	return power, true
}

func (g *RolesVotingGroup) UpdateMembersHandler() dao_interfaces.MessageHandler {
	return &updateMembersHandler{vg: g}
}

func (g *RolesVotingGroup) MemberCount(height int64) uint32 {
	val, ok := g.memberCount.Get("", height)
	if !ok {
		return 0
	}

	return val.(uint32)
}

func (g *RolesVotingGroup) GetMembers(start, end string, limit uint64, height int64) []Member {
	var members []Member
	g.powerByAddr.Iterate(start, end, height, func(k string, v interface{}) bool {
		if limit > 0 && uint64(len(members)) >= limit {
			return true
		}

		members = append(members, Member{
			Address: std.Address(k),
			Power:   v.(uint64),
		})

		return false
	})
	return members
}

func (v *RolesVotingGroup) Render(path string) string {
	sb := strings.Builder{}
	sb.WriteString("Member count: ")
	sb.WriteString(strconv.FormatUint(uint64(v.MemberCount(havl.Latest)), 10))
	sb.WriteString("\n\n")
	sb.WriteString("Total power: ")
	sb.WriteString(strconv.FormatUint(v.TotalPowerAtHeight(havl.Latest), 10))
	sb.WriteString("\n\n")
	sb.WriteString("Members:\n")
	v.powerByAddr.Iterate("", "", havl.Latest, func(k string, v interface{}) bool {
		sb.WriteString("- ")
		sb.WriteString(k)
		sb.WriteString(": ")
		sb.WriteString(strconv.FormatUint(v.(uint64), 10))
		sb.WriteRune('\n')
		return false
	})

	sb.WriteRune('\n')
	return sb.String()
}
