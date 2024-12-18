package dao_roles_group

import (
	"std"

	"gno.land/p/demo/json"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	"gno.land/p/teritori/jsonutil"
	"gno.land/p/teritori/role_manager"
)

type RolesGroup struct {
	dao_interfaces.IRolesModule

	rm *role_manager.RoleManager
}

func NewRolesGroup() *RolesGroup {
	return &RolesGroup{
		rm: role_manager.NewWithAddress(std.PrevRealm().Addr()),
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

func (r *RolesGroup) NewRole(roleName string) {
	r.rm.CreateNewRole(roleName, []string{})
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
