package dao_roles_based

import (
	"gno.land/p/demo/avl"
)

type ResourcesModule struct {
	resources *avl.Tree // string -> daocond.Condition
}

func newResourcesModule() *ResourcesModule {
	return &ResourcesModule{
		resources: avl.NewTree(),
	}
}

func (r *ResourcesModule) setResources(resources *avl.Tree) {
	r.resources = resources
}
