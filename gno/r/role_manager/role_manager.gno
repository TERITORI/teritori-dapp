package role_manager

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ownable"
)

type Permission string

// well known permissions
const (
	ALL Permission = "all"
	ADD_ROLE Permission = "add-role"
	REMOVE_ROLE Permission = "remove-role"
	ADD_PERMISSION Permission = "add-permission"
	REMOVE_PERMISSION Permission = "remove-permission"
	ADD_USER Permission = "add-user"
	REMOVE_USER Permission = "remove-user"
)

type Role struct {
	name string
	permissions []Permission
	users []std.Address // is it pertinent ? the use case is to list all users with a role without having to iterate over all users
}

// well known roles
const (
	OWNER = "owner"
	USER = "user"
)

type User struct {
	roles *avl.Tree // role name -> role // is an array better ? the argument is it's avoid to iterate over all roles to find one
}

var (
	owner *ownable.Ownable
	users *avl.Tree // std.address -> User (role name -> role)
	roles *avl.Tree // role name -> Role
	permissions *avl.Tree // permission name -> Permission
)

func init() {
	caller := std.PrevRealm().Addr()
	owner = ownable.NewWithAddress(caller)
	users = avl.NewTree()
	roles = avl.NewTree()
	permissions = avl.NewTree()

	// create the owner role
	ownerRole := &Role{
		name: OWNER,
		permissions: []Permission{ALL},
		users: []std.Address{},
	}

	roles.Set(OWNER, ownerRole)

	// create the user role
	userRole := &Role{
		name: USER,
		permissions: []Permission{},
		users: []std.Address{},
	}

	roles.Set(USER, userRole)

	// add the owner role to the caller
	user := &User{
		roles: avl.NewTree(),
	}
	user.roles.Set(OWNER, ownerRole)
	ownerRole.users = append(ownerRole.users, caller)
	users.Set(caller, user)

	// fill the permissions
	permissions := []Permission{
		ALL,
		ADD_ROLE,
		REMOVE_ROLE,
		ADD_PERMISSION,
		REMOVE_PERMISSION,
		ADD_USER,
		REMOVE_USER,
	}

	for _, permission := range permissions {
		permissions.Set(string(permission), permission)
	}
}