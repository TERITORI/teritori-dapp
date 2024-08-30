package launchpad_grc20

import (
	"std"
	"strings"
	"hash/adler32"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/grc/grc20"
	"gno.land/p/demo/ownable"
	"gno.land/p/demo/ufmt"
)

type instance struct {
	banker *grc20.Banker
	admin  *ownable.Ownable
	image string
	totalSupplyCap uint
	allowMint bool
	allowBurn bool
}

var instances avl.Tree // symbol -> instance
var factoryVault std.Address

// Initialize tori address as admin & vault for fees
func init() {
	instances = avl.NewWithStringKey()
	admin = std.Address("g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r")
}

func CreateToken(name, symbol string, decimals uint, initialSupply) {
	caller := std.PrevRealm().Addr()
	NewWithAdmin(name, symbol, decimals, initialSupply, caller)
}

func NewWithAdmin(name, symbol, image string, decimals, initialSupply, totalSupplyCap uint, allowMint, allowBurn bool, admin std.Address) {
	exists := instances.Has(symbol)
	if exists {
		panic("this token already exists")
	}
	if totalSupplyCap > 0 && initialSupply > totalSupplyCap {
		panic("initial supply exceeds total supply cap")
	}

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

	inst := instance{
		banker: banker,
		admin:  ownable.NewWithAddress(admin),
		image: image,
		totalSupplyCap: totalSupplyCap,
		allowMint: allowMint,
		allowBurn: allowBurn,
	}

	if instances.Has(name) {
		panic("this combination of symbol and name is already in use")
	}

	instances.Set(name, &inst)
}

func (inst instance) Token() grc20.Token { return inst.banker.Token() }

func TotalSupply(symbol string) uint64 {
	inst := mustGetInstance(symbol)
	return inst.Token().TotalSupply()
}

func BalanceOf(symbol string, owner std.Address) uint64 {
	inst := mustGetInstance(symbol)
	return inst.Token().BalanceOf(owner)
}

func Allowance(symbol string, owner, spender std.Address) uint64 {
	inst := mustGetInstance(symbol)
	return inst.Token().Allowance(owner, spender)
}

func Transfer(symbol string, to std.Address, amount uint64) {
	inst := mustGetInstance(symbol)
	checkErr(inst.Token().Transfer(to, amount))
}

func Approve(symbol string, spender std.Address, amount uint64) {
	inst := mustGetInstance(symbol)
	checkErr(inst.Token().Approve(spender, amount))
}

func TransferFrom(symbol string, from, to std.Address, amount uint64) {
	inst := mustGetInstance(symbol)
	checkErr(inst.Token().TransferFrom(from, to, amount))
}

func Mint(symbol string, to std.Address, amount uint64) {
	inst := mustGetInstance(symbol)
	inst.admin.AssertCallerIsOwner()

	if !inst.allowMint {
		panic("minting is not allowed")
	}

	if inst.totalSupplyCap > 0 {
		totalSupply := inst.Token().TotalSupply()
		if totalSupply + amount > inst.totalSupplyCap {
			panic("minting would exceed total supply cap")
		}
	}
	
	checkErr(inst.banker.Mint(to, amount))
}

func Burn(symbol string, from std.Address, amount uint64) {
	inst := mustGetInstance(symbol)
	inst.admin.AssertCallerIsOwner()
	if !inst.allowBurn {
		panic("burning is not allowed")
	}
	checkErr(inst.banker.Burn(from, amount))
}

func Render(path string) string {
	parts := strings.Split(path, "/")
	c := len(parts)

	switch {
	case path == "":
		return "TODO: list existing tokens and admins"
	case c == 1:
		symbol := parts[0]
		inst := mustGetInstance(symbol)
		return inst.banker.RenderHome()
	case c == 3 && parts[1] == "balance":
		symbol := parts[0]
		inst := mustGetInstance(symbol)
		owner := std.Address(parts[2])
		balance := inst.Token().BalanceOf(owner)
		return ufmt.Sprintf("%d", balance)
	default:
		return "404\n"
	}
}

func mustGetInstance(symbol string) *instance {
	t, exists := instances.Get(symbol)
	if !exists {
		panic("token instance does not exist")
	}
	return t.(*instance)
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}