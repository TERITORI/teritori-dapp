package role_manager

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ownable"
)

const (
	RoleUser  = "user"
	RoleAdmin = "admin"
)

const (
	PermissionAll       = "all"
	PermissionWriteRole = "write:role"
)

type Role struct {
	name        string
	permissions *avl.Tree // permission -> struct{}
	users       *avl.Tree // user addr -> struct{}
}

type RoleManager struct {
	owner *ownable.Ownable
	roles *avl.Tree // role name -> Role
	users *avl.Tree // user addr -> role[]
}

func NewWithAddress(addr std.Address) *RoleManager {
	rm := &RoleManager{
		owner: ownable.NewWithAddress(addr),
		roles: avl.NewTree(),
		users: avl.NewTree(),
	}

	userRole := &Role{
		name:        RoleUser,
		permissions: avl.NewTree(),
		users:       avl.NewTree(),
	}

	adminRole := &Role{
		name:        RoleAdmin,
		permissions: avl.NewTree(),
		users:       avl.NewTree(),
	}
	adminRole.permissions.Set(PermissionAll, struct{}{})

	rm.roles.Set(RoleUser, userRole)
	rm.roles.Set(RoleAdmin, adminRole)

	return rm
}

func (rm *RoleManager) CreateNewRole(roleName string, permissions []string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	if rm.roles.Has(roleName) {
		panic("role already exists")
	}

	role := &Role{
		name:        roleName,
		permissions: avl.NewTree(),
		users:       avl.NewTree(),
	}

	for _, permission := range permissions {
		role.permissions.Set(permission, struct{}{})
	}

	rm.roles.Set(roleName, role)
}

func (rm *RoleManager) DeleteRole(roleName string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	if !rm.roles.Has(roleName) {
		panic("role does not exist")
	}

	role := rm.mustGetRole(roleName)
	role.users.Iterate("", "", func(key string, value interface{}) bool {
		user := std.Address(key)
		userRoles := rm.getUser(user)
		userRoles.Remove(roleName)
		return false
	})
	rm.roles.Remove(roleName)
}

func (rm *RoleManager) AddPermissionToRole(permission string, roleName string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	role := rm.mustGetRole(roleName)
	role.permissions.Set(permission, struct{}{})
}

func (rm *RoleManager) RemovePermissionFromRole(permission string, roleName string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	role := rm.mustGetRole(roleName)
	role.permissions.Remove(permission)
}

func (rm *RoleManager) AddRoleToUser(user std.Address, roleName string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	role := rm.mustGetRole(roleName)
	userRoles := rm.getUser(user)
	userRoles.Set(roleName, role)
	role.users.Set(user.String(), struct{}{})
}

func (rm *RoleManager) RemoveRoleFromUser(user std.Address, roleName string) {
	caller := std.PrevRealm().Addr()
	if !rm.HasPermission(caller, PermissionWriteRole) && rm.owner.Owner() != caller {
		panic("caller does not have permission")
	}

	role := rm.mustGetRole(roleName)
	userRoles := rm.getUser(user)
	userRoles.Remove(roleName)
	role.users.Remove(user.String())
}

func (rm *RoleManager) HasPermission(user std.Address, permission string) bool {
	userRoles := rm.getUser(user)
	res := false
	userRoles.Iterate("", "", func(key string, value interface{}) bool {
		role, ok := value.(*Role)
		if !ok {
			panic("role does not exist")
		}
		if role.permissions.Has(permission) {
			res = true
			return true
		}
		return false
	})
	return res
}

func (rm *RoleManager) HasRole(user std.Address, roleName string) bool {
	userRoles := rm.getUser(user)
	return userRoles.Has(roleName)
}

func (rm *RoleManager) mustGetRole(roleName string) *Role {
	role, ok := rm.roles.Get(roleName)
	if !ok {
		panic("role does not exist")
	}
	return role.(*Role)
}

// if user does not exist, create it with the user role
func (rm *RoleManager) getUser(addr std.Address) *avl.Tree {
	user, ok := rm.users.Get(addr.String())
	if !ok {
		uRole := rm.mustGetRole(RoleUser)
		tree := avl.NewTree()
		tree.Set(RoleUser, uRole)
		rm.users.Set(addr.String(), tree)
		uRole.users.Set(addr.String(), struct{}{})
		return tree
	}
	return user.(*avl.Tree)
}
