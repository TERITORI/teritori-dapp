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
		if dao.Members.HasRole(message.Address.String(), Tier1) {
			panic("member is already a tier1 member")
		}
		if dao.Members.HasRole(message.Address.String(), Tier2) {
			dao.Members.RemoveRoleFromMember(message.Address.String(), Tier2)
		}
		if dao.Members.HasRole(message.Address.String(), Tier3) {
			dao.Members.RemoveRoleFromMember(message.Address.String(), Tier3)
		}
		if dao.Members.IsMember(message.Address.String()) {
			dao.Members.AddRoleToMember(message.Address.String(), Tier1)
		} else {
			dao.Members.AddMember(message.Address.String(), []string{Tier1})
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
		message := msg.(*MsgAddT2Member)
		if dao.Members.HasRole(message.Address.String(), Tier1) {
			panic("member is already a tier1 member")
		}
		if dao.Members.HasRole(message.Address.String(), Tier2) {
			panic("member is already a tier2 member")
		}
		t2MaxSize := dao.Members.CountMembersWithRole(Tier1) * 2
		if dao.Members.CountMembersWithRole(Tier2) >= t2MaxSize {
			panic("tier2 members limit that is twice the number of tier1 members has been reached")
		}
		if dao.Members.HasRole(message.Address.String(), Tier3) {
			dao.Members.RemoveRoleFromMember(message.Address.String(), Tier2)
		}
		if dao.Members.IsMember(message.Address.String()) {
			dao.Members.AddRoleToMember(message.Address.String(), Tier2)
		} else {
			dao.Members.AddMember(message.Address.String(), []string{Tier2})
		}
	})
}

func NewAddT2MemberMsg(payload *MsgAddT2Member) daokit.ExecutableMessage {
	return daokit.NewMessage(MsgAddT2MemberKind, payload)
}
