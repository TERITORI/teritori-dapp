package dao_roles_group

import (
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/role_manager"
)

type RolesGroup struct {
	dao_interfaces.IRoleModule

	rm *role_manager.RoleManager
}

func NewRolesGroup() *RolesGroup {
	return &RolesGroup{
		rm: role_manager.NewRoleManager(),
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
		"totalRoles":  jsonutil.Uint64Node(r.rm.CountRoles()),
		"defaultRole": jsonutil.StringNode(r.defaultRole),
	}).String()
}

func (r *RolesGroup) Render(path string) string {
	return "Not implemented yet"
}

func (r *RolesGroup) HasRole(address std.Address, role string) bool {
	return r.rm.HasRole(address, role)
}

func (r *RolesGroup) NewRole(roleName string, permissions []string) {
	r.rm.CreateNewRole(roleName, permissions)
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
