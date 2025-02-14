package govdao

import (
	"gno.land/p/teritori/daokit"
)

type AddT1MemberMessage struct {
	Address string
}

var _ daokit.ExecutableMessage = &AddT1MemberMessage{}

func (m AddT1MemberMessage) Type() string {
	return "gno.land/r/teritori/govdao.AddT1Member"
}

func (m *AddT1MemberMessage) String() string {
	return m.Address
}

type AddT1MemberMessageHandler struct {
	dao **daokit.DAO
}

func NewAddT1MemberMessageHandler(dao **daokit.DAO) *AddT1MemberMessageHandler {
	return &AddT1MemberMessageHandler{dao: dao}
}

func (h AddT1MemberMessageHandler) Execute(msg daokit.ExecutableMessage) {
	message := msg.(*AddT1MemberMessage)
	dao := *h.dao
	if dao.MemberModule.HasRole(message.Address, Tier1) {
		panic("member is already a tier1 member")
	}
	if dao.MemberModule.HasRole(message.Address, Tier2) {
		dao.MemberModule.RemoveRoleFromMember(message.Address, Tier2)
	}
	if dao.MemberModule.HasRole(message.Address, Tier3) {
		dao.MemberModule.RemoveRoleFromMember(message.Address, Tier3)
	}
	if dao.MemberModule.IsMember(message.Address) {
		dao.MemberModule.AddRoleToMember(message.Address, Tier1)
	} else {
		dao.MemberModule.AddMember(message.Address, []string{Tier1})
	}
}

func (h AddT1MemberMessageHandler) Type() string {
	return AddT1MemberMessage{}.Type()
}

func (h *AddT1MemberMessageHandler) Instantiate(payload map[string]interface{}) daokit.ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	return &AddT1MemberMessage{
		Address: address,
	}
}

type AddT2MemberMessage struct {
	Address string
}

var _ daokit.ExecutableMessage = &AddT2MemberMessage{}

func (m AddT2MemberMessage) Type() string {
	return "gno.land/r/teritori/govdao.AddT2Member"
}

func (m *AddT2MemberMessage) String() string {
	return m.Address
}

type AddT2MemberMessageHandler struct {
	dao **daokit.DAO
}

func NewAddT2MemberMessageHandler(dao **daokit.DAO) *AddT2MemberMessageHandler {
	return &AddT2MemberMessageHandler{dao: dao}
}

func (h AddT2MemberMessageHandler) Execute(msg daokit.ExecutableMessage) {
	message := msg.(*AddT2MemberMessage)
	dao := *h.dao
	if dao.MemberModule.HasRole(message.Address, Tier1) {
		panic("member is already a tier1 member")
	}
	if dao.MemberModule.HasRole(message.Address, Tier2) {
		panic("member is already a tier2 member")
	}
	t2MaxSize := dao.MemberModule.CountMembersWithRole(Tier1) * 2
	if dao.MemberModule.CountMembersWithRole(Tier2) >= t2MaxSize {
		panic("tier2 members limit that is twice the number of tier1 members has been reached")
	}

	if dao.MemberModule.HasRole(message.Address, Tier3) {
		dao.MemberModule.RemoveRoleFromMember(message.Address, Tier3)
	}
	if dao.MemberModule.IsMember(message.Address) {
		dao.MemberModule.AddRoleToMember(message.Address, Tier2)
	} else {
		dao.MemberModule.AddMember(message.Address, []string{Tier2})
	}
}

func (h AddT2MemberMessageHandler) Type() string {
	return AddT2MemberMessage{}.Type()
}

func (h *AddT2MemberMessageHandler) Instantiate(payload map[string]interface{}) daokit.ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	return &AddT2MemberMessage{
		Address: address,
	}
}
