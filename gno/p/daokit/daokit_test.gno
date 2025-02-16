package daokit

import (
	"std"
	"testing"

	"gno.land/p/demo/testutils"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
	carol = testutils.TestAddress("carol")
	dave  = testutils.TestAddress("dave")
)

func TestNewDAO(t *testing.T) {
	std.TestSetOrigCaller(alice)
	dao := NewCore()

	resourcesLen := dao.Resources.Resources.Size()
	if resourcesLen != 0 { // There is 0 default resources
		t.Errorf("Expected 0 resources, got %d", resourcesLen)
	}
}
