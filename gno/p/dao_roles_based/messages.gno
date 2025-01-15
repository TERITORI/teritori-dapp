package dao_roles_based

import (
	"gno.land/p/demo/avl"
	"gno.land/p/demo/json"
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
	registry := &MessagesRegistry{
		handlers: avl.NewTree(),
	}
	registry.register(NewRegisterHandlerExecutableMessageHandler(registry))
	registry.register(NewRemoveHandlerExecutableMessageHandler(registry))
	return registry
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
	return "gno.land/p/teritori/dao_interfaces.RegisterHandler"
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
	return "gno.land/p/teritori/dao_interfaces.RemoveHandler"
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
