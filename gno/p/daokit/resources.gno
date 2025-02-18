package daokit

import (
	"errors"

	"gno.land/p/demo/avl"
	"gno.land/p/teritori/daocond"
)

type resourcesStore struct {
	Resources *avl.Tree // string -> daocond.Condition
}

type Resource struct {
	Handler   MessageHandler
	Condition daocond.Condition
}

func newResourcesStore() *resourcesStore {
	return &resourcesStore{
		Resources: avl.NewTree(),
	}
}

func (r *resourcesStore) setResource(resource *Resource) {
	r.Resources.Set(resource.Handler.Type(), resource)
}

func (r *resourcesStore) removeResource(resource *Resource) {
	r.Resources.Remove(resource.Handler.Type())
}

func (r *resourcesStore) getResource(name string) *Resource {
	value, ok := r.Resources.Get(name)
	if !ok {
		return nil
	}
	res := value.(*Resource)
	return res
}

const MsgAddResourceKind = "gno.land/p/teritori/daokit.AddResource"

func NewAddResourceHandler(r *resourcesStore) MessageHandler {
	return NewMessageHandler(MsgAddResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}

		if getResource(payload.Handler.Type()) != nil {
			panic("ressource " + payload.Handler.Type() + " already exists")
		}
		r.setResource(payload)
	})
}

const MsgRemoveResourceKind = "gno.land/p/teritori/daokit.RemoveResource"

func NewRemoveResourceHandler(r *resourcesStore) MessageHandler {
	return NewMessageHandler(MsgRemoveResourceKind, func(ipayload interface{}) {
		payload, ok := ipayload.(Resource)
		if !ok {
			panic(errors.New("invalid payload type"))
		}
		if getResource(payload.Handler.Type()) == nil {
			panic("ressource " + payload.Handler.Type() + " does not exists")
		}
		r.removeResource(payload)
	})
}
