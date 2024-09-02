package launchpad_grc20


import (
	"std"
	"strings"
	"strconv"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/ufmt"
)

type Airdrop struct {
	token *Token
	merkleRoot string
	amountPerClaim uint64
}

var claimed *avl.Tree // std.address -> bool
var airdrops *avl.Tree // airdrop ID -> airdrop
var nextAirdropID uint64

func init() {
	airdrops = avl.NewTree()
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
		token:  token,
		merkleRoot: merkleRoot,
		amountPerClaim: amountPerClaim,
	}

	airdropID := nextAirdropID
	nextAirdropID++

	airdrops.Set(ufmt.Sprintf("%d", airdropID), &airdrop)

	return airdropID
}

func Redeem(airdropID uint64, claim std.Address, proofs []string) {
	airdrop := GetAirdrop(airdropID)

	if claimed.Has(claim.String()) {
		panic("already claimed")
	}

	// TODO: Verify the proof

	// Redeem the airdrop
	airdrop.token.banker.Mint(claim, airdrop.amountPerClaim)

	claimed.Set(claim.String(), true)
}

// GetAirdrop retrieves the information for a specific airdrop
func GetAirdrop(airdropID uint64) *Airdrop {
	airdropRaw, exists := airdrops.Get(ufmt.Sprintf("%d", airdropID))
	if !exists {
		panic("airdrop not found")
	}

	return airdropRaw.(*Airdrop)
}

// ListAirdrops returns a list of all active airdrop IDs
func ListAirdrops() []uint64 {
	var airdropIDs []uint64
	airdrops.Iterate("", "", func(key string, value interface{}) bool {
		_, id := strconv.ParseUint(key, 10, 64)
		airdropIDs = append(airdropIDs, id)
		return false
	})
	return airdropIDs
}

func assertIsTokenOwner(tokenName string, caller std.Address) {
	// This function should be implemented to check if the caller is the owner of the token
	// You may need to add a method in your launchpad_grc20 package to check ownership
	// For now, we'll use a placeholder implementation
	panic("not implemented: assertIsTokenOwner")
}

func renderAirdropList() string {
	var output strings.Builder
	output.WriteString("Active Airdrops:\n\n")

	airdropIDs := ListAirdrops()
	for _, id := range airdropIDs {
		airdrop := GetAirdrop(id)
		output.WriteString(ufmt.Sprintf("ID: %d, Token: %s\n", id, airdrop.token))
	}

	return output.String()
}

func renderAirdrop(airdropID uint64) string {
	airdrop := GetAirdrop(airdropID)
	
	var output strings.Builder
	output.WriteString(ufmt.Sprintf("Airdrop ID: %d\n", airdropID))
	output.WriteString(ufmt.Sprintf("Token: %s\n", airdrop.token))
	output.WriteString(ufmt.Sprintf("Amount per claim: %d\n", airdrop.amountPerClaim))

	return output.String()
}