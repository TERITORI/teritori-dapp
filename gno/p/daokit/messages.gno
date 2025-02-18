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
