package daokit

import (
	"errors"

	"gno.land/p/demo/ufmt"
)

type ExecutableMessage interface {
	String() string
	Type() string
}

type MessageHandler interface {
	Execute(message ExecutableMessage)
	Type() string
}

func NewMessage(kind string, payload interface{}) ExecutableMessage {
	return &genericMessage{kind: kind, payload: payload}
}

type genericMessage struct {
	kind    string
	payload interface{}
}

// String implements ExecutableMessage.
func (g *genericMessage) String() string {
	return ufmt.Sprintf("%v", g.payload)
}

// Type implements ExecutableMessage.
func (g *genericMessage) Type() string {
	return g.kind
}

func NewMessageHandler(kind string, executor func(interface{})) MessageHandler {
	return &genericMessageHandler{kind: kind, executor: executor}
}

type genericMessageHandler struct {
	kind     string
	executor func(payload interface{})
}

// Execute implements MessageHandler.
func (g *genericMessageHandler) Execute(imsg ExecutableMessage) {
	msg, ok := imsg.(*genericMessage)
	if !ok {
		panic(errors.New("invalid message type"))
	}
	g.executor(msg.payload)
}

// Instantiate implements MessageHandler.
func (g *genericMessageHandler) Instantiate() ExecutableMessage {
	return &genericMessage{
		kind: g.kind,
	}
}

// Type implements MessageHandler.
func (g *genericMessageHandler) Type() string {
	return g.kind
}

const MsgSetResourceKind = "gno.land/p/teritori/daokit.SetResource"

func NewSetResourceHandler(d *Core) MessageHandler {
	return NewMessageHandler(MsgSetResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}

		d.SetResource(payload)
		d.ProposalModule.InvalidateWithResource(payload.Handler.Type())
	})
}

func NewSetResourceMsg(payload *Resource) ExecutableMessage {
	return NewMessage(MsgSetResourceKind, payload)
}

const MsgRemoveResourceKind = "gno.land/p/teritori/daokit.RemoveResource"

func NewRemoveResourceHandler(d *Core) MessageHandler {
	return NewMessageHandler(MsgRemoveResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(*Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		if d.Resources.getResource(payload.Handler.Type()) == nil {
			panic("resource " + payload.Handler.Type() + " does not exists")
		}
		d.Resources.removeResource(payload)
		d.ProposalModule.InvalidateWithResource(payload.Handler.Type())
	})
}

func NewRemoveResourceMsg(payload *Resource) ExecutableMessage {
	return NewMessage(MsgRemoveResourceKind, payload)
}

const MsgCustomMessageKind = "gno.land/p/teritori/daokit.CustomMessage"

type CustomCallbackHandler struct {
	resourceType string
}

func NewCustomCallbackHandler() MessageHandler {
	return &CustomCallbackHandler{
		resourceType: MsgCustomMessageKind,
	}
}

func (m *CustomCallbackHandler) Execute(message ExecutableMessage) {
	msg, ok := message.(*CustomCallback)
	if !ok {
		panic(errors.New("invalid message type"))
	}
	msg.cb()
}

func (m *CustomCallbackHandler) Type() string {
	return m.resourceType
}

type CustomCallback struct {
	cb func()
}

// String implements ExecutableMessage.
func (g *CustomCallback) String() string {
	return ufmt.Sprintf("%v", g.cb)
}

// Type implements ExecutableMessage.
func (g *CustomCallback) Type() string {
	return MsgCustomMessageKind
}

func NewCustomCallback(callback func()) ExecutableMessage {
	return &CustomCallback{cb: callback}
}
