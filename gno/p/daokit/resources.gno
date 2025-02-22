package daokit

import (
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
