package govdao

import (
	"std"

	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/basedao"
	"gno.land/p/teritori/daokit"
)

// XXX: rename Add -> Elect?

// ADD T1 MEMBER

const MsgAddT1MemberKind = "gno.land/r/teritori/govdao.AddT1Member"

type MsgAddT1Member struct {
	Address std.Address
}

func (m *MsgAddT1Member) String() string {
	return ufmt.Sprintf("Add T1 member %s", m.Address.String())
}

func NewAddT1MemberHandler(dao *basedao.DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAddT1MemberKind, func(msg interface{}) {
		message := msg.(*MsgAddT1Member)
		if dao.Members.HasRole(message.Address.String(), "T1") {
			panic("member is already a tier1 member")
		}
		if dao.Members.HasRole(message.Address.String(), "T2") {
			dao.Members.RemoveRoleFromMember(message.Address.String(), "T2")
		}
		if dao.Members.HasRole(message.Address.String(), "T3") {
			dao.Members.RemoveRoleFromMember(message.Address.String(), "T3")
		}
		if dao.Members.IsMember(message.Address.String()) {
			dao.Members.AddRoleToMember(message.Address.String(), "T1")
		} else {
			dao.Members.AddMember(message.Address.String(), []string{"T1"})
		}
	})
}

func NewAddT1MemberMsg(payload *MsgAddT1Member) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgAddT1MemberKind, payload)
}

// ADD T2 MEMBER

const MsgAddT2MemberKind = "gno.land/r/teritori/govdao.AddT2Member"

type MsgAddT2Member struct {
	Address std.Address
}

func (m *MsgAddT2Member) String() string {
	return ufmt.Sprintf("Add T2 member %s", m.Address.String())
}

func NewAddT2MemberHandler(dao *basedao.DAO) daokit.MessageHandler {
	return daokit.NewMessageHandler(MsgAddT2MemberKind, func(msg interface{}) {
		message := msg.(*AddNewT2MemberMessage)
		if dao.Members.HasRole(message.Address, "T1") {
			panic("member is already a tier1 member")
		}
		if dao.Members.HasRole(message.Address, "T2") {
			panic("member is already a tier2 member")
		}
		if dao.Members.HasRole(message.Address, "T3") {
			dao.Members.RemoveRoleFromMember(message.Address, "T3")
		}
		if dao.Members.IsMember(message.Address) {
			dao.Members.AddRoleToMember(message.Address, "T2")
		} else {
			dao.Members.AddMember(message.Address, []string{"T2"})
		}
	})
}

func NewAddT2MemberMsg(payload *MsgAddT2Member) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgAddT2MemberKind, payload)
}

type AddNewT2MemberMessage struct {
	Address string
}
