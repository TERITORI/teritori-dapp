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
	PERM_ALL         = "all"
	PERM_ADD_ROLE    = "add:role"
	PERM_REMOVE_ROLE = "remove:role"
)

type Role struct {
	name        string
	permissions *avl.Tree // permission name -> struct{}
	users       *avl.Tree // std.address -> *User
	next        *Role     // The next role in the hierarchy -> Usage of linked list to allow to know the role hierarchy
	prev        *Role     // The previous role in the hierarchy -> Usage of linked list to allow to know the role hierarchy
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
		permissions: avl.NewTree(),
		users:       avl.NewTree(),
		next:        nil,
		prev:        nil,
	}
	roleManager.roles.Set(ROLE_USER, userRole)

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
		permissions: avl.NewTree(),
		users:       avl.NewTree(),
		next:        lowerRole.next,
		prev:        lowerRole,
	}

	for _, permission := range permissions {
		role.permissions.Set(permission, struct{}{})
	}

	// add the new role to the linked list between the lower role and the next role
	if lowerRole.next != nil {
		lowerRole.next.prev = role
	}
	lowerRole.next = role
	rm.roles.Set(roleName, role)
}

func (rm *RoleManager) DeleteRole(roleName string) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		panic("only the owner can remove a role")
	}

	role := rm.mustGetRole(roleName)
	if roleName == ROLE_USER {
		panic("cannot remove the user role")
	}

	// remove the role from the linked list
	role.prev.next = role.next
	if role.next != nil {
		role.next.prev = role.prev
	}

	// remove the role from the roles tree
	rm.roles.Remove(roleName)

	// remove the role from all users && update the highest role of the users
	role.users.Iterate("", "", func(key string, value interface{}) bool {
		user, ok := value.(*User)
		if !ok {
			return false
		}
		user.roles.Remove(roleName)
		user.refreshHighestRole()
		return false
	})
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
			panic("caller cannot add a role with a higher/same level in the hierarchy than its own highest role")
		}
	}

	role := rm.mustGetRole(roleName)
	targetRaw, exists := rm.users.Get(user.String())
	var target *User
	if !exists {
		target = &User{
			roles:       avl.NewTree(),
			highestRole: role,
		}
		if roleName != ROLE_USER {
			userRole := rm.mustGetRole(ROLE_USER)
			target.roles.Set(ROLE_USER, userRole) // add the user role to the user by default
			userRole.users.Set(user.String(), target)
		}
		target.roles.Set(roleName, role)
		rm.users.Set(user.String(), target)
	} else {
		target = targetRaw.(*User)
		if target.hasRole(roleName) {
			panic("user already has the role")
		}
		target.roles.Set(roleName, role)
		target.setHighestRole(role)
	}
	role.users.Set(user.String(), target)
}

func (rm *RoleManager) RemoveRoleToUser(roleName string, user std.Address) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		if !rm.HasPermission(caller, PERM_REMOVE_ROLE) {
			panic("caller doesn't have the permission to remove role")
		}

		caller := rm.mustGetUser(caller)
		if !caller.highestRole.isHigherThan(roleName) {
			panic("caller cannot remove a role with a higher/same level in the hierarchy than its own highest role")
		}
	}

	target := rm.mustGetUser(user)
	role := rm.mustGetRole(roleName)
	if !target.hasRole(roleName) {
		panic("user doesn't have the role")
	}

	target.roles.Remove(roleName)
	role.users.Remove(user.String())
	target.refreshHighestRole()
}

func (rm RoleManager) HasRole(user std.Address, roleName string) bool {
	u := rm.mustGetUser(user)
	return u.hasRole(roleName)
}

func (rm RoleManager) NewPermission(roleName, permission string) {
	caller := std.PrevRealm().Addr()
	isOwner := rm.owner.Owner().String() == caller.String()

	if !isOwner {
		panic("only the owner can create a new permission")
	}

	if !rm.roles.Has(roleName) {
		panic("role doesn't exists")
	}

	role := rm.mustGetRole(roleName)

	if role.permissions.Has(permission) {
		panic("permission already exists")
	}

	role.permissions.Set(permission, struct{}{})
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

func (u User) setHighestRole(role *Role) {
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

func (u *User) refreshHighestRole() {
	var highestRole *Role
	u.roles.Iterate("", "", func(key string, value interface{}) bool {
		role, ok := value.(*Role)
		if !ok {
			return false
		}
		if highestRole == nil || role.isHigherThan(highestRole.name) {
			highestRole = role
		}
		return false
	})
	if highestRole == nil {
		panic("no role found for the user, this should not happen") // since the user has at least the user role by default
	}
	u.highestRole = highestRole
}

func (u User) hasPermission(permission string) bool {
	found := false
	u.roles.Iterate("", "", func(key string, value interface{}) bool {
		role, ok := value.(*Role)
		if !ok {
			return false
		}

		if role.permissions.Has(permission) {
			found = true
			return true
		}

		return false
	})
	return found
}
