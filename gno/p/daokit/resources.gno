package daokit

import (
	"gno.land/p/demo/avl"
	"gno.land/p/teritori/daocond"
)

type resourcesStore struct {
	resources *avl.Tree // string -> daocond.Condition
}

type Resource struct {
	Handler   MessageHandler
	Condition daocond.Condition
}

func newResourcesStore() *resourcesStore {
	return &resourcesStore{
		resources: avl.NewTree(),
	}
}

func (r *resourcesStore) setResource(resource *Resource) {
	r.resources.Set(resource.Handler.Type(), resource)
}

func (r *resourcesStore) getResource(name string) *Resource {
	value, ok := r.resources.Get(name)
	if !ok {
		return nil
	}
	res := value.(*Resource)
	return res
}
