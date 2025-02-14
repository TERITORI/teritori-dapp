package govdao

import (
	"gno.land/p/teritori/daokit"
)

type AddNewT1MemberMessage struct {
	Address string
}

var _ daokit.ExecutableMessage = &AddNewT1MemberMessage{}

func (m AddNewT1MemberMessage) Type() string {
	return "gno.land/r/teritori/govdao.AddNewT1Member"
}

func (m *AddNewT1MemberMessage) String() string {
	return m.Address
}

type AddNewT1MemberMessageHandler struct {
	dao **daokit.DAO
}

func NewAddNewT1MemberMessageHandler(dao **daokit.DAO) *AddNewT1MemberMessageHandler {
	return &AddNewT1MemberMessageHandler{dao: dao}
}

func (h AddNewT1MemberMessageHandler) Execute(msg daokit.ExecutableMessage) {
	message := msg.(*AddNewT1MemberMessage)
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

func (h AddNewT1MemberMessageHandler) Type() string {
	return AddNewT1MemberMessage{}.Type()
}

func (h *AddNewT1MemberMessageHandler) Instantiate(payload map[string]interface{}) daokit.ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	return &AddNewT1MemberMessage{
		Address: address,
	}
}

type AddNewT2MemberMessage struct {
	Address string
}

var _ daokit.ExecutableMessage = &AddNewT2MemberMessage{}

func (m AddNewT2MemberMessage) Type() string {
	return "gno.land/r/teritori/govdao.AddNewT2Member"
}

func (m *AddNewT2MemberMessage) String() string {
	return m.Address
}

type AddNewT2MemberMessageHandler struct {
	dao **daokit.DAO
}

func NewAddNewT2MemberMessageHandler(dao **daokit.DAO) *AddNewT2MemberMessageHandler {
	return &AddNewT2MemberMessageHandler{dao: dao}
}

func (h AddNewT2MemberMessageHandler) Execute(msg daokit.ExecutableMessage) {
	message := msg.(*AddNewT2MemberMessage)
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

func (h AddNewT2MemberMessageHandler) Type() string {
	return AddNewT2MemberMessage{}.Type()
}

func (h *AddNewT2MemberMessageHandler) Instantiate(payload map[string]interface{}) daokit.ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	return &AddNewT2MemberMessage{
		Address: address,
	}
}
