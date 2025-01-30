package daokit

import (
	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
	"gno.land/p/demo/ufmt"
)

type ExecutableMessage interface {
	ToJSON() *json.Node
	FromJSON(ast *json.Node)

	String() string
	Type() string
}

type MessageHandler interface {
	Execute(message ExecutableMessage)
	Instantiate() ExecutableMessage
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

func (r *MessagesRegistry) messageFromJSON(message *json.Node) ExecutableMessage {
	messageType := json.Must(message.GetKey("type")).MustString()
	payload := json.Must(message.GetKey("payload"))
	h, ok := r.handlers.Get(messageType)
	if !ok {
		panic("invalid ExecutableMessage: invalid message type")
	}

	instance := h.(MessageHandler).Instantiate()
	instance.FromJSON(payload)
	return instance
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
	return "gno.land/p/zenao/dao_roles_based.RegisterHandler"
}

func (m *RegisterHandlerExecutableMessage) FromJSON(ast *json.Node) {
	panic("not implemented")
}

func (m *RegisterHandlerExecutableMessage) ToJSON() *json.Node {
	panic("not implemented")
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

func (h *RegisterHandlerExecutableMessageHandler) Instantiate() ExecutableMessage {
	return &RegisterHandlerExecutableMessage{}
}

func (h *RegisterHandlerExecutableMessageHandler) Execute(msg ExecutableMessage) {
	h.registry.register(msg.(*RegisterHandlerExecutableMessage).Handler)
}

type RemoveHandlerExecutableMessage struct {
	HandlerType string
}

var _ ExecutableMessage = &RemoveHandlerExecutableMessage{}

func (m RemoveHandlerExecutableMessage) Type() string {
	return "gno.land/p/zenao/dao_roles_based.RemoveHandler"
}

func (m *RemoveHandlerExecutableMessage) FromJSON(ast *json.Node) {
	m.HandlerType = ast.MustString()
}

func (m *RemoveHandlerExecutableMessage) ToJSON() *json.Node {
	return json.StringNode("", m.HandlerType)
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

func (h *RemoveHandlerExecutableMessageHandler) Instantiate() ExecutableMessage {
	return &RemoveHandlerExecutableMessage{}
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
	return "gno.land/p/zenao/dao_roles_based.AddNewMember"
}

func (m *AddNewMemberMessage) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	m.Address = obj["address"].MustString()
	rolesArray := obj["roles"].MustArray()
	for _, role := range rolesArray {
		m.Roles = append(m.Roles, role.MustString())
	}
}

func (m *AddNewMemberMessage) ToJSON() *json.Node {
	roles := []*json.Node{}
	for _, role := range m.Roles {
		roles = append(roles, json.StringNode("", role))
	}
	rolesNode := json.ArrayNode("", roles)
	return json.ObjectNode("", map[string]*json.Node{
		"address": json.StringNode("", m.Address),
		"roles":   rolesNode,
	})
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

func (h *AddNewMemberMessageHandler) Instantiate() ExecutableMessage {
	return &AddNewMemberMessage{}
}

type RemoveMemberMessage struct {
	Address string
}

var _ ExecutableMessage = &RemoveMemberMessage{}

func (m RemoveMemberMessage) Type() string {
	return "gno.land/p/zenao/dao_roles_based.RemoveMember"
}

func (m *RemoveMemberMessage) FromJSON(ast *json.Node) {
	m.Address = ast.MustString()
}

func (m *RemoveMemberMessage) ToJSON() *json.Node {
	return json.StringNode("", m.Address)
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

func (h *RemoveMemberMessageHandler) Instantiate() ExecutableMessage {
	return &RemoveMemberMessage{}
}

type AddRoleToUserMessage struct {
	Address string
	Role    string
}

var _ ExecutableMessage = &AddRoleToUserMessage{}

func (m AddRoleToUserMessage) Type() string {
	return "gno.land/p/zenao/dao_roles_based.AddRoleToUser"
}

func (m *AddRoleToUserMessage) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	m.Address = obj["address"].MustString()
	m.Role = obj["role"].MustString()
}

func (m *AddRoleToUserMessage) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"address": json.StringNode("", m.Address),
		"role":    json.StringNode("", m.Role),
	})
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

func (h *AddRoleToUserMessageHandler) Instantiate() ExecutableMessage {
	return &AddRoleToUserMessage{}
}

type RemoveRoleFromUserMessage struct {
	Address string
	Role    string
}

var _ ExecutableMessage = &RemoveRoleFromUserMessage{}

func (m RemoveRoleFromUserMessage) Type() string {
	return "gno.land/p/zenao/dao_roles_based.RemoveRoleFromUser"
}

func (m *RemoveRoleFromUserMessage) FromJSON(ast *json.Node) {
	obj := ast.MustObject()
	m.Address = obj["address"].MustString()
	m.Role = obj["role"].MustString()
}

func (m *RemoveRoleFromUserMessage) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"address": json.StringNode("", m.Address),
		"role":    json.StringNode("", m.Role),
	})
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

func (h *RemoveRoleFromUserMessageHandler) Instantiate() ExecutableMessage {
	return &RemoveRoleFromUserMessage{}
}
