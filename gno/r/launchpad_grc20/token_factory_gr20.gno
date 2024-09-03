package launchpad_grc20

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/grc/grc20"
	"gno.land/p/demo/ownable"
)

// Maybe rename since banker contains a struct grc20.Token, could be source of confusion maybe call it Instance
type Token struct {
	banker         *grc20.Banker
	admin          *ownable.Ownable
	image          string
	totalSupplyCap uint64
	allowMint      bool
	allowBurn      bool
}

var (
	tokens       *avl.Tree // symbol -> token
	factoryVault std.Address
)

// Initialize tori address as admin & vault for fees
func init() {
	tokens = avl.NewTree()
	factoryVault = std.Address("g1ctt28t7sdyp28qzkvlfyx0hyxuz6vz7nplwm9c")
}

func NewToken(name, symbol, image string, decimals uint, initialSupply, totalSupplyCap uint64, allowMint, allowBurn bool) {
	// Admin of the token is the caller
	admin := std.PrevRealm().Addr()

	// Check if token already exists in our factory
	exists := tokens.Has(name)
	if exists {
		panic("this token already exists")
	}
	if totalSupplyCap > 0 && initialSupply > totalSupplyCap {
		panic("initial supply exceeds total supply cap")
	}
	if decimals > 18 {
		panic("decimals must be 18 or less")
	}

	// Create a new token
	banker := grc20.NewBanker(name, symbol, decimals)

	// Fee is 2.5% of initial supply
	fee := initialSupply * 25 / 1000
	netSupply := initialSupply - fee
	if fee > 0 {
		banker.Mint(factoryVault, fee)
	}
	if netSupply > 0 {
		banker.Mint(admin, netSupply)
	}

	inst := Token{
		banker:         banker,
		admin:          ownable.NewWithAddress(admin),
		image:          image,
		totalSupplyCap: totalSupplyCap,
		allowMint:      allowMint,
		allowBurn:      allowBurn,
	}

	tokens.Set(name, &inst)
}

func (inst Token) Token() grc20.Token { return inst.banker.Token() }

func TotalSupply(name string) uint64 {
	inst := mustGetToken(name)
	return inst.Token().TotalSupply()
}

func BalanceOf(name string, owner std.Address) uint64 {
	inst := mustGetToken(name)
	return inst.Token().BalanceOf(owner)
}

func Allowance(name string, owner, spender std.Address) uint64 {
	inst := mustGetToken(name)
	return inst.Token().Allowance(owner, spender)
}

func Transfer(name string, to std.Address, amount uint64) {
	inst := mustGetToken(name)
	checkErr(inst.Token().Transfer(to, amount))
}

func Approve(name string, spender std.Address, amount uint64) {
	inst := mustGetToken(name)
	checkErr(inst.Token().Approve(spender, amount))
}

func TransferFrom(name string, from, to std.Address, amount uint64) {
	inst := mustGetToken(name)
	checkErr(inst.Token().TransferFrom(from, to, amount))
}

func Mint(name string, to std.Address, amount uint64) {
	inst := mustGetToken(name)
	inst.admin.AssertCallerIsOwner()

	if !inst.allowMint {
		panic("minting is not allowed")
	}

	if inst.totalSupplyCap > 0 {
		totalSupply := inst.Token().TotalSupply()
		if totalSupply+amount > inst.totalSupplyCap {
			panic("minting would exceed total supply cap")
		}
	}

	checkErr(inst.banker.Mint(to, amount))
}

func Burn(name string, from std.Address, amount uint64) {
	inst := mustGetToken(name)
	inst.admin.AssertCallerIsOwner()
	if !inst.allowBurn {
		panic("burning is not allowed")
	}
	checkErr(inst.banker.Burn(from, amount))
}

func mustGetToken(name string) *Token {
	t, exists := tokens.Get(name)
	if !exists {
		panic("token instance does not exist")
	}
	return t.(*Token)
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
