package role_manager

import (
	"fmt"
	"testing"

	"gno.land/p/demo/testutils"
)

var (
	alice = testutils.TestAddress("alice")
	bob   = testutils.TestAddress("bob")
)

func TestNewWithAddress(t *testing.T) {
	rm := NewWithAddress(bob)
	if rm.owner.Owner() != bob {
		t.Errorf("owner = %v, want %v", rm.owner.Owner(), bob)
	}
}
