package dao_roles_based

import (
	"gno.land/p/demo/avl"
	"gno.land/p/teritori/daocond"
)

type ResourcesModule struct {
	resources *avl.Tree // string -> *daocond.Condition
}

func newResourcesModule() *ResourcesModule {
	return &ResourcesModule{
		resources: avl.NewTree(),
	}
}

func (r *ResourcesModule) setResources(resources *avl.Tree) {
	r.resources = resources
}

func (r *ResourcesModule) getResource(name string) daocond.Condition {
	value, ok := r.resources.Get(name)
	if !ok {
		return nil
	}
	condition := value.(daocond.Condition)
	return condition
}
