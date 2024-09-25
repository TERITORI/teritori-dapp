package role_manager

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ownable"
)

// well known roles
const (
	OWNER = "owner"
	USER  = "user"
)

// well known permissions
const (
	ALL               = "all"
	ADD_ROLE          = "add-role"
	REMOVE_ROLE       = "remove-role"
	ADD_PERMISSION    = "add-permission"
	REMOVE_PERMISSION = "remove-permission"
	ADD_USER          = "add-user"
	REMOVE_USER       = "remove-user"
)

type Role struct {
	name        string
	permissions []string
	users       []std.Address // is it pertinent ? the use case is to list all users with a role without having to iterate over all users
	next        *Role         // The next role in the hierarchy -> Usage of linked list to allow to know the role hierarchy
	prev        *Role         // The previous role in the hierarchy -> Usage of linked list to allow to know the role hierarchy
}

type User struct {
	roles       *avl.Tree // role name -> *Role // is an array better ? the argument is it's avoid to iterate over all roles to find one
	highestRole *Role     // is it pertinent ? the use case is to know the highest role of a user without having to iterate over all roles the user has
}

type RoleManager struct {
	owner       *ownable.Ownable
	users       *avl.Tree // std.address -> *User (role name -> role)
	roles       *avl.Tree // role name -> *Role
	permissions *avl.Tree // permission name -> struct{} (empty struct to save memory)
}

func NewWithAddress(addr std.Address) *RoleManager {
	roleManager := &RoleManager{
		owner:       ownable.NewWithAddress(addr),
		users:       avl.NewTree(),
		roles:       avl.NewTree(),
		permissions: avl.NewTree(),
	}

	userRole := &Role{
		name:        USER,
		permissions: []string{},
		users:       []std.Address{},
		next:        nil,
		prev:        nil,
	}
	roleManager.roles.Set(USER, userRole)

	permissions := []string{
		ALL,
		ADD_ROLE,
		REMOVE_ROLE,
		ADD_PERMISSION,
		REMOVE_PERMISSION,
		ADD_USER,
		REMOVE_USER,
	}

	for _, permission := range permissions {
		roleManager.permissions.Set(permission, struct{}{})
	}

	return roleManager
}

func (rm *RoleManager) AddRoleToUser(user std.Address, roleName string) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		if !rm.HasPermission(caller, ADD_ROLE) {
			panic("caller doesn't have the permission to add role")
		}

		caller := rm.mustGetUser(caller)
		if !caller.highestRole.IsHigherThan(roleName) {
			panic("caller cannot add a role with a higher level in the hierarchy than its own highest role")
		}
	}

	role := rm.mustGetRole(roleName)
	targetRaw, exists := rm.users.Get(user.String())
	if !exists {
		target := &User{
			roles:       avl.NewTree(),
			highestRole: role,
		}
		target.roles.Set(roleName, role)
		rm.users.Set(user.String(), target)
	} else {
		target := targetRaw.(*User)
		if target.hasRole(roleName) {
			panic("user already has the role")
		}
		target.roles.Set(roleName, role)
		target.updateHighestRole(role)
	}
}

func (rm RoleManager) mustGetRole(roleName string) *Role {
	roleRaw, exists := rm.roles.Get(roleName)
	if !exists {
		panic("role doesn't exists")
	}
	return roleRaw.(*Role)
}

func (rm RoleManager) HasPermission(user std.Address, permission string) bool {
	if !rm.IsPermissionExists(permission) {
		return false
	}
	u := rm.mustGetUser(user)
	return u.hasPermission(permission)
}

func (rm RoleManager) IsPermissionExists(permission string) bool {
	_, exists := rm.permissions.Get(permission)
	if !exists {
		return false
	}
	return true
}

func (rm RoleManager) mustGetUser(address std.Address) *User {
	userRaw, exists := rm.users.Get(address.String())
	if !exists {
		panic("user doesn't exists")
	}
	return userRaw.(*User)
}

func (r *Role) IsHigherThan(roleName string) bool {
	tmp := r
	for tmp.next != nil {
		if tmp.next.name == roleName {
			return true
		}
		tmp = tmp.next
	}
	return false
}

func (u User) hasRole(roleName string) bool {
	_, exists := u.roles.Get(roleName)
	return exists
}

func (u User) updateHighestRole(role *Role) {
	tmp := u.highestRole
	if tmp == nil {
		u.highestRole = role
		return
	}
	for tmp.next != nil {
		if tmp.next.name == role.name {
			u.highestRole = role
			return
		}
	}
}

func (u User) hasPermission(permission string) bool {
	found := false
	u.roles.Iterate("", "", func(key string, value interface{}) bool {
		role, ok := value.(*Role)
		if !ok {
			return false
		}

		for _, p := range role.permissions {
			if p == permission {
				found = true
				return true
			}
			if p == ALL {
				found = true
				return true
			}
		}

		return false
	})
	return found
}
