package daokit

import (
	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
)

type ExecutableMessage interface {
	String() string
	Type() string
}

type MessageHandler interface {
	Execute(message ExecutableMessage)
	Instantiate(payload map[string]interface{}) ExecutableMessage
	Type() string
}

type MessagesRegistry struct {
	handlers *avl.Tree
}

func newMessagesRegistry() *MessagesRegistry {
	return &MessagesRegistry{handlers: avl.NewTree()}
}

func (dao *DAO) initMessagesRegistry() {
	dao.MessagesRegistry.register(NewRegisterHandlerExecutableMessageHandler(dao.MessagesRegistry))
	dao.MessagesRegistry.register(NewRemoveHandlerExecutableMessageHandler(dao.MessagesRegistry))
	dao.MessagesRegistry.register(NewAddNewMemberMessageHandler(dao))
	dao.MessagesRegistry.register(NewRemoveMemberMessageHandler(dao))
	dao.MessagesRegistry.register(NewAddRoleToUserMessageHandler(dao))
	dao.MessagesRegistry.register(NewRemoveRoleFromUserMessageHandler(dao))
}

func (r *MessagesRegistry) register(handler MessageHandler) {
	r.handlers.Set(handler.Type(), handler)
}

func (r *MessagesRegistry) remove(t string) {
	r.handlers.Remove(t)
}

func (r *MessagesRegistry) execute(msg ExecutableMessage) {
	h, ok := r.handlers.Get(msg.Type())
	if !ok {
		panic("invalid ExecutableMessage: invalid message type")
	}
	h.(MessageHandler).Execute(msg)
}

type RegisterHandlerExecutableMessage struct {
	Handler MessageHandler
}

var _ ExecutableMessage = &RegisterHandlerExecutableMessage{}

func (m RegisterHandlerExecutableMessage) Type() string {
	return "gno.land/p/teritori/daokit.RegisterHandler"
}

func (m *RegisterHandlerExecutableMessage) String() string {
	return m.Handler.Type()
}

type RegisterHandlerExecutableMessageHandler struct {
	registry *MessagesRegistry
}

var _ MessageHandler = &RegisterHandlerExecutableMessageHandler{}

func NewRegisterHandlerExecutableMessageHandler(registry *MessagesRegistry) *RegisterHandlerExecutableMessageHandler {
	return &RegisterHandlerExecutableMessageHandler{registry: registry}
}

func (h RegisterHandlerExecutableMessageHandler) Type() string {
	return RegisterHandlerExecutableMessage{}.Type()
}

func (h *RegisterHandlerExecutableMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	handler, ok := payload["handler"].(MessageHandler)
	if !ok {
		panic("Invalid payload format: expected to have a 'handler' key with a MessageHandler value")
	}
	return &RegisterHandlerExecutableMessage{
		Handler: handler,
	}
}

func (h *RegisterHandlerExecutableMessageHandler) Execute(msg ExecutableMessage) {
	h.registry.register(msg.(*RegisterHandlerExecutableMessage).Handler)
}

type RemoveHandlerExecutableMessage struct {
	HandlerType string
}

var _ ExecutableMessage = &RemoveHandlerExecutableMessage{}

func (m RemoveHandlerExecutableMessage) Type() string {
	return "gno.land/p/teritori/daokit.RemoveHandler"
}

func (m *RemoveHandlerExecutableMessage) String() string {
	return m.HandlerType
}

type RemoveHandlerExecutableMessageHandler struct {
	registry *MessagesRegistry
}

var _ MessageHandler = &RemoveHandlerExecutableMessageHandler{}

func NewRemoveHandlerExecutableMessageHandler(registry *MessagesRegistry) *RemoveHandlerExecutableMessageHandler {
	return &RemoveHandlerExecutableMessageHandler{registry: registry}
}

func (h RemoveHandlerExecutableMessageHandler) Type() string {
	return RemoveHandlerExecutableMessage{}.Type()
}

func (h *RemoveHandlerExecutableMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	handleType, ok := payload["handlerType"].(string)
	if !ok {
		panic("Invalid payload format: expected to have a 'handlerType' key with a string value")
	}

	return &RemoveHandlerExecutableMessage{
		HandlerType: handleType,
	}
}

func (h *RemoveHandlerExecutableMessageHandler) Execute(msg ExecutableMessage) {
	h.registry.remove(msg.(*RemoveHandlerExecutableMessage).HandlerType)
}

type AddNewMemberMessage struct {
	Address string
	Roles   []string
}

var _ ExecutableMessage = &AddNewMemberMessage{}

func (m AddNewMemberMessage) Type() string {
	return "gno.land/p/teritori/daokit.AddNewMember"
}

func (m *AddNewMemberMessage) String() string {
	return ufmt.Sprintf("Add new member: %s with roles: %v", m.Address, m.Roles)
}

type AddNewMemberMessageHandler struct {
	dao *DAO
}

func NewAddNewMemberMessageHandler(dao *DAO) *AddNewMemberMessageHandler {
	return &AddNewMemberMessageHandler{dao: dao}
}

func (h AddNewMemberMessageHandler) Execute(msg ExecutableMessage) {
	message := msg.(*AddNewMemberMessage)
	h.dao.MemberModule.addMember(message.Address, message.Roles)
}

func (h AddNewMemberMessageHandler) Type() string {
	return AddNewMemberMessage{}.Type()
}

func (h *AddNewMemberMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	roles, ok := payload["roles"].([]string)
	if !ok {
		panic("invalid payload format: expected to have a 'roles' key with a []string value")
	}
	return &AddNewMemberMessage{
		Address: address,
		Roles:   roles,
	}
}

type RemoveMemberMessage struct {
	Address string
}

var _ ExecutableMessage = &RemoveMemberMessage{}

func (m RemoveMemberMessage) Type() string {
	return "gno.land/p/teritori/daokit.RemoveMember"
}

func (m *RemoveMemberMessage) String() string {
	return ufmt.Sprintf("Remove member: %s", m.Address)
}

type RemoveMemberMessageHandler struct {
	dao *DAO
}

func NewRemoveMemberMessageHandler(dao *DAO) *RemoveMemberMessageHandler {
	return &RemoveMemberMessageHandler{dao: dao}
}

func (h RemoveMemberMessageHandler) Execute(msg ExecutableMessage) {
	message := msg.(*RemoveMemberMessage)
	h.dao.MemberModule.removeMember(message.Address)
}

func (h RemoveMemberMessageHandler) Type() string {
	return RemoveMemberMessage{}.Type()
}

func (h *RemoveMemberMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	return &RemoveMemberMessage{
		Address: address,
	}
}

type AddRoleToUserMessage struct {
	Address string
	Role    string
}

var _ ExecutableMessage = &AddRoleToUserMessage{}

func (m AddRoleToUserMessage) Type() string {
	return "gno.land/p/teritori/daokit.AddRoleToUser"
}

func (m *AddRoleToUserMessage) String() string {
	return ufmt.Sprintf("Add role: %s to user: %s", m.Role, m.Address)
}

type AddRoleToUserMessageHandler struct {
	dao *DAO
}

func NewAddRoleToUserMessageHandler(dao *DAO) *AddRoleToUserMessageHandler {
	return &AddRoleToUserMessageHandler{dao: dao}
}

func (h AddRoleToUserMessageHandler) Execute(msg ExecutableMessage) {
	message := msg.(*AddRoleToUserMessage)
	h.dao.MemberModule.addRoleToMember(message.Address, message.Role)
}

func (h AddRoleToUserMessageHandler) Type() string {
	return AddRoleToUserMessage{}.Type()
}

func (h *AddRoleToUserMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	role, ok := payload["role"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'role' key with a string value")
	}
	return &AddRoleToUserMessage{
		Address: address,
		Role:    role,
	}
}

type RemoveRoleFromUserMessage struct {
	Address string
	Role    string
}

var _ ExecutableMessage = &RemoveRoleFromUserMessage{}

func (m RemoveRoleFromUserMessage) Type() string {
	return "gno.land/p/teritori/daokit.RemoveRoleFromUser"
}

func (m *RemoveRoleFromUserMessage) String() string {
	return ufmt.Sprintf("Remove role: %s from user: %s", m.Role, m.Address)
}

type RemoveRoleFromUserMessageHandler struct {
	dao *DAO
}

func NewRemoveRoleFromUserMessageHandler(dao *DAO) *RemoveRoleFromUserMessageHandler {
	return &RemoveRoleFromUserMessageHandler{dao: dao}
}

func (h RemoveRoleFromUserMessageHandler) Execute(msg ExecutableMessage) {
	message := msg.(*RemoveRoleFromUserMessage)
	h.dao.MemberModule.removeRoleFromMember(message.Address, message.Role)
}

func (h RemoveRoleFromUserMessageHandler) Type() string {
	return RemoveRoleFromUserMessage{}.Type()
}

func (h *RemoveRoleFromUserMessageHandler) Instantiate(payload map[string]interface{}) ExecutableMessage {
	address, ok := payload["address"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'address' key with a string value")
	}
	role, ok := payload["role"].(string)
	if !ok {
		panic("invalid payload format: expected to have a 'role' key with a string value")
	}
	return &RemoveRoleFromUserMessage{
		Address: address,
		Role:    role,
	}
}
