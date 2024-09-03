package launchpad_grc20

import (
	"gno.land/p/demo/mux"
	"gno.land/p/demo/ufmt"
)

var router *mux.Router

const (
	HOME_PATH = ""

	TOKEN_PATH         = "token"
	TOKEN_DETAIL_PATH  = "token/{name}"                   // {name} is a placeholder for the token name
	TOKEN_BALANCE_PATH = "token/{name}/balance/{address}" // {name} is a placeholder for the token name, {address} is a placeholder for the address of the account

	AIRDROP_PATH        = "airdrop"
	AIRDROP_DETAIL_PATH = "airdrop/{id}" // {id} is a placeholder for the airdrop id

	SALES_PATH = "sales"
)

func init() {
	router = mux.NewRouter()
	router.HandleFunc(HOME_PATH, renderHomePage)
	router.HandleFunc(TOKEN_PATH, renderTokenPage)
	router.HandleFunc(TOKEN_DETAIL_PATH, renderTokenDetailPage)
	router.HandleFunc(TOKEN_BALANCE_PATH, renderTokenBalancePage)
}

func renderTokenPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# 🪙 Tokens GRC20 Homepage 🪙\n")
	res.Write("A GRC20 token is a digital asset standard on the Gno Chain, similar to ERC20 tokens on Ethereum.\nIt defines a set of rules for creating and managing fungible tokens, ensuring compatibility across the Gno ecosystem.\n\n")
	res.Write("You can create your own token by referring to the help section in the documentation and using the NewToken function.\nAfter creating your token, you can manage it easily through the provided interface.\nTo view details of any token created by this factory, simply visit the page ``:token/{name}``, replacing ``{name}`` with the token's name.\n")
}

func renderTokenDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	tokenName := req.GetVar("name")
	token := mustGetToken(tokenName)

	res.Write("# 🪙 Token Details 🪙\n")

	res.Write(ufmt.Sprintf("### Name: %s - Symbol: %s\n", token.banker.GetName(), token.banker.GetSymbol()))
	res.Write(ufmt.Sprintf("#### Total Supply: %d %s\n", token.banker.TotalSupply(), token.banker.GetSymbol()))
	res.Write(ufmt.Sprintf("#### Decimals: %d\n", token.banker.GetDecimals()))
	res.Write(ufmt.Sprintf("#### Admin: %s\n\n", token.admin.Owner().String()))
	res.Write(ufmt.Sprintf("#### Total Supply Cap (0 = unlimited): %d %s\n\n", token.totalSupplyCap, token.banker.GetSymbol()))

	if token.allowMint {
		res.Write("#### Mintable: true\n\n")
	} else {
		res.Write("#### Mintable: false\n\n")
	}

	if token.allowBurn {
		res.Write("#### Burnable: true\n\n")
	} else {
		res.Write("#### Burnable: false\n\n")
	}
}

func renderTokenBalancePage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("Coming soon...")
}

func renderAirdropPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("Coming soon...")
}

func renderAirdropDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("Coming soon...")
}

func renderSalesPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("Coming soon...")
}

func renderHomePage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# Welcome to the GRC20 Launchpad\n This is a platform for launching GRC20 tokens and managing airdrops.\n You can create a new token, mint and burn tokens, and create airdrops and sales periods. \n\n## Available Actions\n- :token\n- :token/{name}\n- :token/{name}/balance/{addr}\n- :airdrop\n- :airdrop/{id}\n- :sales\n\n\n*Note: An enhanced user interface is available on [Teritori](https://teritori.com/)*\n")
}

func Render(path string) string {
	return router.Render(path)
}
