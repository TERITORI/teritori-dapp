package launchpad_grc20

import (
	"std"
	"strconv"

	"gno.land/p/demo/avl"
	"gno.land/p/demo/grc/grc20"
	"gno.land/p/demo/json"
	"gno.land/p/demo/ownable"
	"gno.land/p/demo/seqid"
)

const LENGTH_LAST_TOKENS_CACHE = 10

type Token struct {
	banker         *grc20.Banker
	admin          *ownable.Ownable
	image          string
	totalSupplyCap uint64
	allowMint      bool
	allowBurn      bool
	AirdropsIDs    []seqid.ID
	SalesIDs       []seqid.ID
}

var _ grc20.Token = (*Token)(nil)

var (
	tokens            *avl.Tree // name -> token
	factoryAdmin      *ownable.Ownable
	factoryVault      std.Address
	lastTokensCreated = []*Token{}
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
		AirdropsIDs:    []seqid.ID{},
		SalesIDs:       []seqid.ID{},
	}

	tokens.Set(name, &inst)

	if len(lastTokensCreated) == LENGTH_LAST_TOKENS_CACHE {
		lastTokensCreated = lastTokensCreated[:(LENGTH_LAST_TOKENS_CACHE - 1)]
	}
	lastTokensCreated = append([]*Token{&inst}, lastTokensCreated...)
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

func (token Token) ToJSON() *json.Node {
	return json.ObjectNode("", map[string]*json.Node{
		"name":           json.StringNode("", token.banker.GetName()),
		"symbol":         json.StringNode("", token.banker.GetSymbol()),
		"decimals":       json.StringNode("", strconv.FormatUint(uint64(token.banker.GetDecimals()), 10)),
		"admin":          json.StringNode("", token.admin.Owner().String()),
		"image":          json.StringNode("", token.image),
		"totalSupply":    json.StringNode("", strconv.FormatInt(int64(token.TotalSupply()), 10)),
		"totalSupplyCap": json.StringNode("", strconv.FormatInt(int64(token.totalSupplyCap), 10)),
		"allowMint":      json.BoolNode("", token.allowMint),
		"allowBurn":      json.BoolNode("", token.allowBurn),
	})
}

func SetFactoryVault(vault std.Address) {
	factoryAdmin.AssertCallerIsOwner()
	factoryVault = vault
}

func GetLastTokensJSON() string {
	nodes := make([]*json.Node, len(lastTokensCreated))
	for i, token := range lastTokensCreated {
		nodes[i] = token.ToJSON()
	}
	return json.ArrayNode("", nodes).String()
}

func GetUserTokensJSON(user std.Address) string {
	var nodes []*json.Node
	tokens.Iterate("", "", func(key string, value interface{}) bool {
		token, _ := value.(*Token)
		if token.admin.Owner() == user {
			nodes = append(nodes, token.ToJSON())
		}
		return false
	})
	return json.ArrayNode("", nodes).String()
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
