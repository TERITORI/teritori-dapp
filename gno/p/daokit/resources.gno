package daokit

import (
	"gno.land/p/demo/avl"
	"gno.land/p/teritori/daocond"
)

type ResourcesModule struct {
	resources *avl.Tree // string -> daocond.Condition
}

type Resource struct {
	Resource  string
	Handler   MessageHandler
	Condition daocond.Condition
}

func newResourcesModule() *ResourcesModule {
	return &ResourcesModule{
		resources: avl.NewTree(),
	}
}

func (r *ResourcesModule) setResource(resources Resource) {
	r.resources.Set(resources.Resource, resources.Condition)
}

func (r *ResourcesModule) getResource(name string) daocond.Condition {
	value, ok := r.resources.Get(name)
	if !ok {
		return nil
	}
	condition := value.(daocond.Condition)
	return condition
}
