package dao_voting_roles

import (
	"std"
	"strconv"
	"strings"

	"gno.land/p/demo/json"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/havl"
	"gno.land/p/teritori/jsonutil"
	"gno.land/p/teritori/role_manager"
)

type Member struct {
	Address std.Address
	Power   uint64
}

type ResourceVPower struct {
	Resource string
	Power    uint64
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

type VotingRoles struct {
	powerByAddr     *havl.Tree // std.Address -> uint64
	totalPowers     *havl.Tree // "" -> uint64
	memberCount     *havl.Tree // "" -> uint32
	rm              *role_manager.RoleManager
	resourcesVPower *havl.Tree // roles -> ResourceVPower[]
}

var _ dao_interfaces.IVotingModule = (*VotingRoles)(nil)

func NewVotingRoles() *VotingRoles {
	return &VotingRoles{
		powerByAddr:     havl.NewTree(),
		totalPowers:     havl.NewTree(),
		memberCount:     havl.NewTree(),
		rm:              role_manager.NewWithAddress(std.PrevRealm().Addr()),
		resourcesVPower: havl.NewTree(),
	}
}

func (v *VotingRoles) Info() dao_interfaces.ModuleInfo {
	return dao_interfaces.ModuleInfo{
		Kind:    "gno.land/p/teritori/roles_voting_group",
		Version: "0.1.0",
	}
}

func (v *VotingRoles) ConfigJSON() string {
	totalPowers := make(map[string]*json.Node)
	v.totalPowers.Iterate("", "", havl.Latest, func(key string, value interface{}) bool {
		totalPower := value.(uint64)
		totalPowers[key] = json.StringNode("", strconv.FormatUint(totalPower, 10))
		return false
	})

	rolesPowers := make(map[string]*json.Node)
	v.resourcesVPower.Iterate("", "", havl.Latest, func(key string, value interface{}) bool {
		rp := value.([]ResourceVPower)
		elems := make([]*json.Node, 0, len(rp))
		for _, rrp := range rp {
			elem := json.ObjectNode("", map[string]*json.Node{
				"resource": json.StringNode("", rrp.Resource),
				"power":    json.StringNode("", strconv.FormatUint(rrp.Power, 10)),
			})
			elems = append(elems, elem)
		}
		rolesPowers[key] = json.ArrayNode("", elems)
		return false
	})

	return json.ObjectNode("", map[string]*json.Node{
		"totalPowers": json.ObjectNode("", totalPowers),
		"rolesPowers": json.ObjectNode("", rolesPowers),
		"members":     jsonutil.Uint32Node(v.MemberCount(havl.Latest)),
	}).String()
}

func (v *VotingRoles) GetMembersJSON(start, end string, limit uint64, height int64) string {
	members := v.GetMembers(start, end, limit, height)
	membersJSON := make([]*json.Node, len(members))
	for i, m := range members {
		membersJSON[i] = m.ToJSON()
	}
	return json.ArrayNode("", membersJSON).String()
}

func (v *VotingRoles) VotingPowerAtHeight(addr std.Address, resource string, height int64) uint64 {
	userPower, ok := v.powerByAddr.Get(addr.String(), height)
	if !ok {
		return 0
	}

	rolePower := v.GetMemberResourceVPower(addr, resource, height)
	if rolePower > userPower.(uint64) {
		return rolePower
	}

	return userPower.(uint64)
}

func (v *VotingRoles) TotalPowerAtHeight(resource string, height int64) uint64 {
	p, ok := v.totalPowers.Get(resource, height)
	if !ok {
		p, ok = v.totalPowers.Get("", height)
		if !ok {
			return 0
		}
	}

	return p.(uint64)
}

func (v *VotingRoles) SetMemberPower(addr std.Address, power uint64) {
	if power == 0 {
		v.RemoveMember(addr)
		return
	}

	iprevious, ok := v.powerByAddr.Get(addr.String(), havl.Latest)
	if !ok {
		v.memberCount.Set("", v.MemberCount(havl.Latest)+1)
	}

	previous := uint64(0)
	if ok {
		previous = iprevious.(uint64)
	}

	if power == previous {
		return
	}

	v.powerByAddr.Set(addr.String(), power)

	ipreviousTotal, ok := v.totalPowers.Get("", havl.Latest)
	previousTotal := uint64(0)
	if ok {
		previousTotal = ipreviousTotal.(uint64)
	}

	v.totalPowers.Set("", (previousTotal+power)-previous)
}

func (v *VotingRoles) RemoveMember(addr std.Address) (uint64, bool) {
	p, removed := v.powerByAddr.Remove(addr.String())
	if !removed {
		return 0, false
	}

	v.memberCount.Set("", v.MemberCount(havl.Latest)-1)
	power := p.(uint64)
	v.totalPowers.Set("", v.TotalPowerAtHeight("", havl.Latest)-power)
	return power, true
}

func (v *VotingRoles) UpdateMembersHandler() dao_interfaces.MessageHandler {
	return &updateMembersHandler{vg: v}
}

func (v *VotingRoles) MemberCount(height int64) uint32 {
	val, ok := v.memberCount.Get("", height)
	if !ok {
		return 0
	}

	return val.(uint32)
}

func (v *VotingRoles) GetMembers(start, end string, limit uint64, height int64) []Member {
	var members []Member
	v.powerByAddr.Iterate(start, end, height, func(k string, v interface{}) bool {
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

func (v *VotingRoles) Render(path string) string {
	sb := strings.Builder{}
	sb.WriteString("Member count: ")
	sb.WriteString(strconv.FormatUint(uint64(v.MemberCount(havl.Latest)), 10))
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

func (v *VotingRoles) HasRole(address std.Address, role string) bool {
	return v.rm.HasRole(address, role)
}

func (v *VotingRoles) NewRoleJSON(roleName, resourcesJSON string) {
	node := json.Must(json.Unmarshal([]byte(resourcesJSON)))
	arr := node.MustArray()
	resources := make([]ResourceVPower, len(arr))
	for i, n := range arr {
		node := n.MustObject()
		resources[i] = ResourceVPower{
			Resource: node["resource"].MustString(),
			Power:    jsonutil.MustUint64(node["power"]),
		}
	}
	v.NewRole(roleName, resources)
}

func (v *VotingRoles) NewRole(roleName string, resources []ResourceVPower) {
	v.rm.CreateNewRole(roleName, []string{})
	if len(resources) > 0 {
		v.resourcesVPower.Set(roleName, resources)
	}
}

func (v *VotingRoles) DeleteRole(roleName string) {
	v.rm.DeleteRole(roleName)
}

func (v *VotingRoles) GrantRole(address std.Address, role string) {
	v.rm.AddRoleToUser(address, role)
}

func (v *VotingRoles) RevokeRole(address std.Address, role string) {
	v.rm.RemoveRoleFromUser(address, role)
}

func (v *VotingRoles) GetMemberRoles(address std.Address) []string {
	return v.rm.GetUserRoles(address)
}

func (v *VotingRoles) GetMemberResourceVPower(address std.Address, resource string, height int64) uint64 {
	roles := v.rm.GetUserRoles(address)
	power := uint64(0)
	for _, role := range roles {
		resourcesRaw, exists := v.resourcesVPower.Get(role, height)
		if !exists {
			continue
		}
		resources := resourcesRaw.([]ResourceVPower)
		for _, r := range resources {
			if r.Resource == resource && r.Power > power {
				power = r.Power
			}
		}
	}
	return power
}
