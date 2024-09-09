package launchpad_grc20

import (
	"std"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/grc/grc20"
	"gno.land/p/demo/ownable"
)

type Token struct {
	banker         *grc20.Banker
	admin          *ownable.Ownable
	image          string
	totalSupplyCap uint64
	allowMint      bool
	allowBurn      bool
}

var _ grc20.Token = (*Token)(nil)

var (
	tokens       *avl.Tree // symbol -> token
	factoryAdmin *ownable.Ownable
	factoryVault std.Address
)

// Initialize tori address as admin & vault for fees
func init() {
	tokens = avl.NewTree()
	factoryAdmin = ownable.NewWithAddress(std.Address("g1ctt28t7sdyp28qzkvlfyx0hyxuz6vz7nplwm9c"))
	factoryVault = std.Address("g1ctt28t7sdyp28qzkvlfyx0hyxuz6vz7nplwm9c")
}

func NewToken(name, symbol, image string, decimals uint, initialSupply, totalSupplyCap uint64, allowMint, allowBurn bool) {
	admin := std.PrevRealm().Addr()

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

	banker := grc20.NewBanker(name, symbol, decimals)

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

func Mint(name string, to std.Address, amount uint64) {
	token := mustGetToken(name)
	token.admin.AssertCallerIsOwner()

	if !token.allowMint {
		panic("minting is not allowed")
	}

	if token.totalSupplyCap > 0 {
		totalSupply := token.TotalSupply()
		if totalSupply+amount > token.totalSupplyCap {
			panic("minting would exceed total supply cap")
		}
	}

	checkErr(token.banker.Mint(to, amount))
}

func Burn(name string, from std.Address, amount uint64) {
	token := mustGetToken(name)
	token.admin.AssertCallerIsOwner()
	if !token.allowBurn {
		panic("burning is not allowed")
	}
	checkErr(token.banker.Burn(from, amount))
}

func TotalSupply(name string) uint64 {
	token := mustGetToken(name)
	return token.TotalSupply()
}

func BalanceOf(name string, owner std.Address) uint64 {
	token := mustGetToken(name)
	return token.BalanceOf(owner)
}

func Allowance(name string, owner, spender std.Address) uint64 {
	token := mustGetToken(name)
	return token.Allowance(owner, spender)
}

func Transfer(name string, to std.Address, amount uint64) {
	token := mustGetToken(name)
	checkErr(token.Transfer(to, amount))
}

func Approve(name string, spender std.Address, amount uint64) {
	token := mustGetToken(name)
	checkErr(token.Approve(spender, amount))
}

func TransferFrom(name string, from, to std.Address, amount uint64) {
	token := mustGetToken(name)
	checkErr(token.TransferFrom(from, to, amount))
}

func (token Token) Token() grc20.Token                 { return token.banker.Token() }
func (token Token) GetName() string                    { return token.banker.GetName() }
func (token Token) GetSymbol() string                  { return token.banker.GetSymbol() }
func (token Token) GetDecimals() uint                  { return token.banker.GetDecimals() }
func (token Token) TotalSupply() uint64                { return token.Token().TotalSupply() }
func (token Token) BalanceOf(owner std.Address) uint64 { return token.Token().BalanceOf(owner) }
func (token Token) Transfer(to std.Address, amount uint64) error {
	return token.Token().Transfer(to, amount)
}
func (token Token) Allowance(owner, spender std.Address) uint64 {
	return token.Token().Allowance(owner, spender)
}
func (token Token) Approve(spender std.Address, amount uint64) error {
	return token.Token().Approve(spender, amount)
}
func (token Token) TransferFrom(from, to std.Address, amount uint64) error {
	return token.Token().TransferFrom(from, to, amount)
}

func SetFactoryVault(vault std.Address) {
	factoryAdmin.AssertCallerIsOwner()
	factoryVault = vault
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
