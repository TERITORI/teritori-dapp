package role_manager

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ownable"
)

// well known roles
const (
	ROLE_USER = "user"
)

// well known permissions
const (
	PERM_ALL               = "all"
	PERM_ADD_ROLE          = "add-role"
	PERM_REMOVE_ROLE       = "remove-role"
	PERM_ADD_PERMISSION    = "add-permission"
	PERM_REMOVE_PERMISSION = "remove-permission"
	PERM_ADD_USER          = "add-user"
	PERM_REMOVE_USER       = "remove-user"
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
	owner *ownable.Ownable
	users *avl.Tree // std.address -> *User (role name -> role)
	roles *avl.Tree // role name -> *Role
}

func NewWithAddress(addr std.Address) *RoleManager {
	roleManager := &RoleManager{
		owner: ownable.NewWithAddress(addr),
		users: avl.NewTree(),
		roles: avl.NewTree(),
	}

	userRole := &Role{
		name:        ROLE_USER,
		permissions: []string{},
		users:       []std.Address{},
		next:        nil,
		prev:        nil,
	}
	roleManager.roles.Set(ROLE_USER, userRole)

	permissions := []string{
		PERM_ALL,
		PERM_ADD_ROLE,
		PERM_REMOVE_ROLE,
		PERM_ADD_PERMISSION,
		PERM_REMOVE_PERMISSION,
		PERM_ADD_USER,
		PERM_REMOVE_USER,
	}

	return roleManager
}

func (rm *RoleManager) NewRole(roleName string, permissions []string, lowerRoleName string) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		panic("only the owner can create a new role")
	}

	if rm.roles.Has(roleName) {
		panic("role already exists")
	}

	if lowerRoleName == "" {
		panic("lower role name cannot be empty, the lowest role is the user role")
	}

	lowerRole := rm.mustGetRole(lowerRoleName)
	role := &Role{
		name:        roleName,
		permissions: permissions,
		users:       []std.Address{},
		next:        lowerRole.next,
		prev:        lowerRole,
	}

	// add the new role to the linked list between the lower role and the next role
	if lowerRole.next != nil {
		lowerRole.next.prev = role
	}
	lowerRole.next = role
	rm.roles.Set(roleName, role)
}

func (rm *RoleManager) AddRoleToUser(roleName string, user std.Address) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		if !rm.HasPermission(caller, PERM_ADD_ROLE) {
			panic("caller doesn't have the permission to add role")
		}

		caller := rm.mustGetUser(caller)
		if !caller.highestRole.isHigherThan(roleName) {
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
	role.users = append(role.users, user)
}

func (rm RoleManager) HasRole(user std.Address, roleName string) bool {
	u := rm.mustGetUser(user)
	return u.hasRole(roleName)
}

func (rm RoleManager) HasPermission(user std.Address, permission string) bool {
	u := rm.mustGetUser(user)
	return u.hasPermission(permission)
}

func (rm RoleManager) mustGetRole(roleName string) *Role {
	roleRaw, exists := rm.roles.Get(roleName)
	if !exists {
		panic("role doesn't exists")
	}
	return roleRaw.(*Role)
}

func (rm RoleManager) mustGetUser(address std.Address) *User {
	userRaw, exists := rm.users.Get(address.String())
	if !exists {
		panic("user doesn't exists")
	}
	return userRaw.(*User)
}

func (r *Role) isHigherThan(roleName string) bool {
	tmp := r
	for tmp.next != nil {
		if tmp.next.name == roleName {
			return false
		}
		tmp = tmp.next
	}
	return true
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
			if p == PERM_ALL {
				found = true
				return true
			}
		}

		return false
	})
	return found
}
