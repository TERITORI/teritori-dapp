package dao2

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/teritori/daocond"
	"gno.land/p/teritori/role_manager"
)

type daoStruct struct {
	// xxx: is it useful to use a "complex" type like RoleManager here since the permissions are not used? (let not use it for now)
	roleManager *role_manager.RoleManager
	members     *avl.Tree // address -> struct{}
	resources   *avl.Tree // string -> daocond.Condition
}

// func NewDAO(membersInfo *avl.Tree, resourcesInfo *avl.Tree, rm *role_manager.RoleManager) *daoStruct {
// 	return &daoStruct{
// 		roleManager: rm,
// 		members:     membersInfo,
// 		resources:   resourcesInfo,
// 	}
// }

// func NewDAOJSON(daoJSON string) *daoStruct {
// 	nodes, err := json.Unmarshal([]byte(daoJSON))
// 	if err != nil {
// 		panic("invalid json format")
// 	}
// 	obj := nodes.MustObject()
// 	objRoles := obj["roles"].MustArray()
// 	rm := role_manager.NewWithAddress(std.Address{})
// 	for _, r := range objRoles {
// 		rm.CreateNewRole(r.MustString(), []string{})
// 	}
// 	objMembers := obj["members"].MustArray()
// 	members := avl.NewTree()
// 	for _, m := range objMembers {
// 		member := m.MustObject()
// 		addr := member["address"].MustString()
// 		objMemberRoles := member["roles"].MustArray()
// 		for _, r := range objMemberRoles {
// 			rm.AddRoleToUser(std.Address{}, r.MustString())
// 		}
// 		members.Set(addr, struct{}{})
// 	}
// 	objResources := obj["resources"].MustArray()
// 	resources := avl.NewTree()
// 	for _, r := range objResources {
// 		resource := r.MustObject()
// 		resources.Set(resource["name"].MustString(), struct{}{})
// 	}
// }

// split the function into the JSON parsing and the actual DAO creation
func NewDAOJSON(rolesJSON string, membersJSON string, resourcesJSON string) {
	dao := &daoStruct{
		roleManager: role_manager.NewWithAddress(std.CurrentRealm().Addr()),
		members:     avl.NewTree(),
		resources:   avl.NewTree(),
	}
	rolesNodes, err := json.Unmarshal([]byte(rolesJSON))
	if err != nil {
		panic("invalid roles json format")
	}
	for _, r := range rolesNodes.MustArray() {
		dao.roleManager.CreateNewRole(r.MustString(), []string{})
	}
	membersNodes, err := json.Unmarshal([]byte(membersJSON))
	if err != nil {
		panic("invalid members json format")
	}
	for _, m := range membersNodes.MustArray() {
		member := m.MustObject()
		addr := member["address"].MustString()
		objMemberRoles := member["roles"].MustArray()
		for _, r := range objMemberRoles {
			dao.roleManager.AddRoleToUser(std.Address(addr), r.MustString())
		}
		dao.members.Set(addr, struct{}{})
	}
	resourcesNodes, err := json.Unmarshal([]byte(resourcesJSON))
	if err != nil {
		panic("invalid resources json format")
	}
	for _, r := range resourcesNodes.MustArray() {
		resource := r.MustObject()
		condition := daocond.ConditionFromJSON(resource["condition"].MustString(), dao.HasRoleFn, dao.IsMemberFn, dao.MembersCountFn)
		dao.resources.Set(resource["name"].MustString(), condition)
	}
}

func (d *daoStruct) HasRoleFn(memberId string, role string) bool {
	return d.roleManager.HasRole(std.Address(memberId), role)
}

func (d *daoStruct) IsMemberFn(memberId string) bool {
	return d.members.Has(memberId)
}

func (d *daoStruct) MembersCountFn() uint64 {
	return uint64(d.members.Size())
}
