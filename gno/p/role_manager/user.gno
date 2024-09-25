package role_manager

import (
	"gno.land/p/demo/avl"
)

type User struct {
	roles *avl.Tree // role name -> *Role // is an array better ? the argument is it's avoid to iterate over all roles to find one
}

func mustGetUser(address std.Address) *User {
	userRaw, exists := users.Get(address)
	if !exists {
		panic("user doesn't exists")
	}
	return userRaw.(*User)
}