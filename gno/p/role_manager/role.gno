package role_manager

// well known roles
const (
	OWNER = "owner"
	USER = "user"
)

// well known permissions
const (
	ALL = "all"
	ADD_ROLE = "add-role"
	REMOVE_ROLE = "remove-role"
	ADD_PERMISSION = "add-permission"
	REMOVE_PERMISSION = "remove-permission"
	ADD_USER = "add-user"
	REMOVE_USER = "remove-user"
)

type Role struct {
	name string
	permissions []string
	users []std.Address // is it pertinent ? the use case is to list all users with a role without having to iterate over all users
}

func HasPermission(user std.Address, permission string) bool {
	if !IsPermissionExists(permission) {
		panic("permission doesn't exists")
	}
	user := mustGetUser(user)
}

func IsPermissionExists(permission string) bool {
	_, exists := permissions.Get(permission)
	if !exists {
		return false
	}
	return true
}