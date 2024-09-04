package launchpad_grc20

import (
	"std"
	"strings"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
)

type Airdrop struct {
	token          *Token
	merkleRoot     string
	amountPerClaim uint64
}

var (
	claimed       *avl.Tree // std.address -> bool
	airdrops      *avl.Tree // airdrop ID -> airdrop
	nextAirdropID uint64
)

func init() {
	airdrops = avl.NewTree()
	claimed = avl.NewTree()
	nextAirdropID = 1
}

func NewAirdrop(tokenName, merkleRoot string, amountPerClaim uint64) uint64 {
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
		amountPerClaim: amountPerClaim,
	}

	airdropID := nextAirdropID
	nextAirdropID++

	airdrops.Set(ufmt.Sprintf("%d", airdropID), &airdrop)

	return airdropID
}

func Redeem(airdropID uint64, proofs []Node) {
	airdrop := GetAirdrop(airdropID)
	claimer := std.PrevRealm().Addr()

	if claimed.Has(claimer.String()) {
		panic("already claimed")
	}

	leaf := Leaf{[]byte(claimer.String())}
	if !Verify(airdrop.merkleRoot, leaf, proofs) {
		panic("invalid proof")
	}

	airdrop.token.banker.Mint(claimer, airdrop.amountPerClaim)

	claimed.Set(claimer.String(), true)
}

// GetAirdrop retrieves the information for a specific airdrop
func GetAirdrop(airdropID uint64) *Airdrop {
	airdropRaw, exists := airdrops.Get(ufmt.Sprintf("%d", airdropID))
	if !exists {
		panic("airdrop not found")
	}

	return airdropRaw.(*Airdrop)
}

// To be used in Render (next step not done yet)
func renderAirdropList() string {
	var output strings.Builder
	output.WriteString("Active Airdrops:\n\n")

	airdrops.Iterate("", "", func(key string, value interface{}) bool {
		airdrop, ok := value.(*Airdrop)
		if !ok {
			panic("value should have type of *Airdrop")
		}
		output.WriteString(ufmt.Sprintf("Airdrop ID: %s\n", key))
		output.WriteString(ufmt.Sprintf("Token: %s\n", airdrop.token.banker.GetName()))
		output.WriteString(ufmt.Sprintf("Amount per claim: %d\n\n", airdrop.amountPerClaim))
		return false
	})

	return output.String()
}
