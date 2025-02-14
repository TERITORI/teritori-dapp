package basedao

import (
	"errors"

	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daokit"
)

const MsgAddMemberKind = "gno.land/p/teritori/basedao.AddMember"

type msgAddMember struct {
	Address string
	Roles   []string
}

// XXX: add stringer

func NewAddMemberHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAddMemberKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*msgAddMember)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.addMember(payload.Address, payload.Roles)
	})
}

const MsgRemoveMemberKind = "gno.land/p/teritori/basedao.RemoveMember"

func NewRemoveMemberHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgRemoveMemberKind, func(ipayload interface{}) {
		address, ok := ipayload.(string)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.removeMember(address)
	})
}

const MsgAssignRoleKind = "gno.land/p/teritori/basedao.AssignRole"

type MsgAssignRole struct {
	Address string
	Role    string
}

// XXX: add stringer

func (m *MsgAssignRole) String() string {
	return ufmt.Sprintf("Assign role %q to user %s", m.Role, m.Address)
}

func NewAssignRoleHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAssignRoleKind, func(i interface{}) {
		payload, ok := i.(*MsgAssignRole)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.addRoleToMember(payload.Address, payload.Role)
	})
}

const MsgUnassignRoleKind = "gno.land/p/teritori/basedao.UnassignRole"

type MsgUnassignRole struct {
	Address string
	Role    string
}

// XXX: add stringer

func (m *MsgUnassignRole) String() string {
	return ufmt.Sprintf("Remove role %q from user %s", m.Role, m.Address)
}

func NewUnassignRoleHandler(dao *DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAssignRoleKind, func(i interface{}) {
		payload, ok := i.(*MsgAssignRole)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		dao.Members.removeRoleFromMember(payload.Address, payload.Role)
	})
}
