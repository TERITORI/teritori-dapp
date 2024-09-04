package launchpad_grc20

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
)

type Airdrop struct {
	token          *Token
	merkleRoot     string
	amountPerAddr  uint64
	alreadyClaimed *avl.Tree
}

var (
	airdrops      *avl.Tree // airdrop ID -> airdrop
	nextAirdropID uint64
)

func init() {
	airdrops = avl.NewTree()
	nextAirdropID = 1
}

func NewAirdrop(tokenName, merkleRoot string, amountPerAddr uint64) uint64 {
	// check if the caller is the owner of the token
	token := mustGetToken(tokenName)
	token.admin.AssertCallerIsOwner()

	// check that the token is mintable
	if !token.allowMint {
		panic("token is not mintable")
	}

	airdrop := Airdrop{
		token:          token,
		merkleRoot:     merkleRoot,
		amountPerAddr:  amountPerAddr,
		alreadyClaimed: avl.NewTree(),
	}

	airdropID := nextAirdropID
	nextAirdropID++

	airdrops.Set(ufmt.Sprintf("%d", airdropID), &airdrop)

	return airdropID
}

func Redeem(airdropID uint64, proofs []Node) {
	airdrop := mustGetAirdrop(airdropID)
	caller := std.PrevRealm().Addr()

	if airdrop.hasAlreadyClaimed(caller) {
		panic("already claimed")
	}

	leaf := Leaf{[]byte(caller.String())}
	if !Verify(airdrop.merkleRoot, leaf, proofs) {
		panic("invalid proof")
	}

	airdrop.token.banker.Mint(caller, airdrop.amountPerAddr)

	airdrop.alreadyClaimed.Set(caller.String(), true)
}

// mustGetAirdrop retrieves the information for a specific airdrop
func mustGetAirdrop(airdropID uint64) *Airdrop {
	airdropRaw, exists := airdrops.Get(ufmt.Sprintf("%d", airdropID))
	if !exists {
		panic("airdrop not found")
	}

	return airdropRaw.(*Airdrop)
}

func (a *Airdrop) hasAlreadyClaimed(caller std.Address) bool {
	return a.alreadyClaimed.Has(caller.String())
}
