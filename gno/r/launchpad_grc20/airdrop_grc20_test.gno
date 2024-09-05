package launchpad_grc20

import (
	"fmt"
	"std"
	"testing"
)

func TestRedeem(t *testing.T) {
	leaves := []Hashable{
		Leaf{[]byte("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg")},
		Leaf{[]byte("g1ld6uaykyugld4rnm63rcy7vju4zx23lufml3jv")},
	}
	tree := NewTree(leaves)
	root := tree.Root()
	proofs, err := tree.Proof(leaves[0])
	NewToken("MikaelVallenetCoin", "MVC", "https://mikaelvallenet.com", 18, 1000000, 1000000000, true, true)
	airdropID := NewAirdrop("MikaelVallenetCoin", root, 100, 0, 0)
	std.TestSetOrigCaller(std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"))
	Redeem(airdropID, proofs)
	token := mustGetToken("MikaelVallenetCoin")
	balance := token.Token().BalanceOf(std.Address("g126gx6p6d3da4ymef35ury6874j6kys044r7zlg"))
	if balance != 100 {
		t.Errorf("Expected balance to be 100, got %d", balance)
	}
}
