package role_manager

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ownable"
)

type RoleManager struct {
	owner *ownable.Ownable
	users *avl.Tree // std.address -> *User (role name -> role)
	roles *avl.Tree // role name -> *Role
	permissions *avl.Tree // permission name -> struct{} (empty struct to save memory)
}

func NewWithAddress(addr std.Address) *RoleManager {
	roleManager := &RoleManager{
		owner: ownable.NewWithAddress(addr),
		users: avl.NewTree(),
		roles: avl.NewTree(),
		permissions: avl.NewTree(),
	}

	userRole := &Role{
		name: USER,
		permissions: []Permission{},
		users: []std.Address{},
	}
	roleManager.roles.Set(USER, userRole)

	persmissions := []string{
		ALL,
		ADD_ROLE,
		REMOVE_ROLE,
		ADD_PERMISSION,
		REMOVE_PERMISSION,
		ADD_USER,
		REMOVE_USER,
	}

	for _, permission := range permissions {
		permissions.Set(permission, struct{}{})
	}
}

func (rm *RoleManager) AddRoleToUser(user std.Address, roleName string, lowerRoleName string) {
	// check the caller has the permissions to add role
	
	// check the caller have a role with an higher level than the role to add
	// check the caller is higher rank than the user
	// check the role to add not already exists
	// check the user not already have the role
	// if the user doesn't exists, create it
	// add the role to the user
}

