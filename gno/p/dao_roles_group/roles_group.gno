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
	dao_interfaces.IRolesModule

	rm               *role_manager.RoleManager
	permissionsPower *avl.Tree // roles -> PermissionPower[]
}

// TODO: Rename permission to resourcePower
type PermissionPower struct {
	Permission string
	Power      uint64
}

func NewRolesGroup() *RolesGroup {
	return &RolesGroup{
		rm:               role_manager.NewWithAddress(std.PrevRealm().Addr()),
		permissionsPower: avl.NewTree(),
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

// TODO: Create a method fromJSON for PermissionPower struct
// TODO: Create a NewRoleJSON method that accepts a JSON string and that calls NewRole with the parsed values
func (r *RolesGroup) NewRole(roleName string, permissionsJSON string) {
	node := json.Must(json.Unmarshal([]byte(permissionsJSON)))
	arr := node.MustArray()
	permissions := make([]PermissionPower, len(arr))
	for i, n := range arr {
		node := n.MustObject()
		permissions[i] = PermissionPower{
			Permission: node["permission"].MustString(),
			Power:      jsonutil.MustUint64(node["power"]),
		}
	}
	// Since we want to match permissions with a voting power, we need to store them in a separate tree for now
	r.rm.CreateNewRole(roleName, []string{})
	if len(permissions) > 0 {
		r.permissionsPower.Set(roleName, permissions)
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

func (r *RolesGroup) GetMemberResourcePower(address std.Address, resource string) uint64 {
	roles := r.rm.GetUserRoles(address)
	power := uint64(0)
	for _, role := range roles {
		permissionRaw, exists := r.permissionsPower.Get(role)
		if !exists {
			continue
		}
		permissions := permissionRaw.([]PermissionPower)
		for _, p := range permissions {
			if p.Permission == resource && p.Power > power {
				power = p.Power
			}
		}
	}
	return power
}

func (r *RolesGroup) SetMemberResourcePower(address std.Address, resource string, power uint64) {
	panic("Not implemented yet")
}
