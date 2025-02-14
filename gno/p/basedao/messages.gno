package basedao

import (
	"errors"
	"std"

	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daokit"
)

// ADD MEMBER

const MsgAddMemberKind = "gno.land/p/teritori/basedao.AddMember"

type MsgAddMember struct {
	Address std.Address
	Roles   []string
}

func (m *MsgAddMember) String() string {
	return ufmt.Sprintf("Add member %s with roles %v", m.Address, m.Roles)
}

func NewAddMemberHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAddMemberKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*MsgAddMember)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.AddMember(payload.Address.String(), payload.Roles)
	})
}

func NewAddMemberMsg(payload *MsgAddMember) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgAddMemberKind, payload)
}

// REMOVE MEMBER

const MsgRemoveMemberKind = "gno.land/p/teritori/basedao.RemoveMember"

func NewRemoveMemberHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgRemoveMemberKind, func(ipayload interface{}) {
		address, ok := ipayload.(std.Address)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.RemoveMember(address.String())
	})
}

func NewRemoveMemberMsg(address std.Address) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgRemoveMemberKind, address)
}

// ASSIGN ROLE

const MsgAssignRoleKind = "gno.land/p/teritori/basedao.AssignRole"

type MsgAssignRole struct {
	Address std.Address
	Role    string
}

func (m *MsgAssignRole) String() string {
	return ufmt.Sprintf("Assign role %q to user %s", m.Role, m.Address)
}

func NewAssignRoleHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAssignRoleKind, func(i interface{}) {
		payload, ok := i.(*MsgAssignRole)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.AddRoleToMember(payload.Address.String(), payload.Role)
	})
}

func NewAssignRoleMsg(payload *MsgAssignRole) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgAssignRoleKind, payload)
}

// UNASSIGN ROLE

const MsgUnassignRoleKind = "gno.land/p/teritori/basedao.UnassignRole"

type MsgUnassignRole struct {
	Address std.Address
	Role    string
}

func (m *MsgUnassignRole) String() string {
	return ufmt.Sprintf("Remove role %q from user %s", m.Role, m.Address)
}

func NewUnassignRoleHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAssignRoleKind, func(i interface{}) {
		payload, ok := i.(*MsgAssignRole)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.RemoveRoleFromMember(payload.Address.String(), payload.Role)
	})
}

func NewUnassignRoleMsg(payload *MsgUnassignRole) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgUnassignRoleKind, payload)
}

// EDIT PROFILE

const MsgEditProfileKind = "gno.land/p/teritori/basedao.EditProfile"

func NewEditProfileMsg(kv ...[2]string) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgEditProfileKind, kv)
}

func NewEditProfileHandler(setter ProfileStringSetter, allowedFields []string) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgEditProfileKind, func(imsg interface{}) {
		msg, ok := imsg.([][2]string)
		if !ok {
			panic(errors.New("invalid message type"))
		}
		for _, elem := range msg {
			k, v := elem[0], elem[1]
			if len(allowedFields) > 0 && !stringSliceContains(allowedFields, k) {
				panic(ufmt.Errorf("unauthorized field %q", k))
			}
			setter(k, v)
		}
	})
}

func stringSliceContains(s []string, target string) bool {
	for _, elem := range s {
		if elem == target {
			return true
		}
	}
	return false
}
