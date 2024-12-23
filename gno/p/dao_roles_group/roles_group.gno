package dao_roles_group

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/jsonutil"
	"gno.land/p/teritori/role_manager"
)

type RolesGroup struct {
	rm              *role_manager.RoleManager
	resourcesVPower *avl.Tree // roles -> ResourceVPower[]
}

type ResourceVPower struct {
	Resource string
	Power    uint64
}

func NewRolesGroup() *RolesGroup {
	return &RolesGroup{
		rm:              role_manager.NewWithAddress(std.PrevRealm().Addr()),
		resourcesVPower: avl.NewTree(),
	}
}

func (r *RolesGroup) Info() dao_interfaces.ModuleInfo {
	return dao_interfaces.ModuleInfo{
		Kind:    "gno/p/teritori/dao_roles_group",
		Version: "0.1.0",
	}
}

func (r *RolesGroup) ConfigJSON() string {
	return json.ObjectNode("", map[string]*json.Node{
		"totalRoles": jsonutil.IntNode(r.rm.CountRoles()),
	}).String()
}

func (r *RolesGroup) Render(path string) string {
	return "Not implemented yet"
}

func (r *RolesGroup) HasRole(address std.Address, role string) bool {
	return r.rm.HasRole(address, role)
}

func (r *RolesGroup) NewRoleJSON(roleName, resourcesJSON string) {
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
	r.NewRole(roleName, resources)
}

func (r *RolesGroup) NewRole(roleName string, resources []ResourceVPower) {
	r.rm.CreateNewRole(roleName, []string{})
	if len(resources) > 0 {
		r.resourcesVPower.Set(roleName, resources)
	}
}

func (r *RolesGroup) DeleteRole(roleName string) {
	r.rm.DeleteRole(roleName)
}

func (r *RolesGroup) GrantRole(address std.Address, role string) {
	r.rm.AddRoleToUser(address, role)
}

func (r *RolesGroup) RevokeRole(address std.Address, role string) {
	r.rm.RemoveRoleFromUser(address, role)
}

func (r *RolesGroup) GetMemberRoles(address std.Address) []string {
	return r.rm.GetUserRoles(address)
}

func (r *RolesGroup) GetMemberResourceVPower(address std.Address, resource string) uint64 {
	roles := r.rm.GetUserRoles(address)
	power := uint64(0)
	for _, role := range roles {
		resourcesRaw, exists := r.resourcesVPower.Get(role)
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
