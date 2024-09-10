package launchpad_grc20

import (
	"std"
	"strconv"
	"time"

	"gno.land/p/demo/mux"
	"gno.land/p/demo/ufmt"
)

var router *mux.Router

const (
	HOME_PATH = ""

	TOKEN_PATH         = "token"
	TOKEN_DETAIL_PATH  = "token/{name}"                   // {name} is a placeholder for the token name
	TOKEN_BALANCE_PATH = "token/{name}/balance/{address}" // {name} is a placeholder for the token name, {address} is a placeholder for the address of the account

	AIRDROP_PATH             = "airdrop"
	AIRDROP_DETAIL_PATH      = "airdrop/{id}"                 // {id} is a placeholder for the airdrop id
	AIRDROP_CLAIM_CHECK_PATH = "airdrop/{id}/claim/{address}" // {id} is a placeholder for the airdrop id, {address} is a placeholder for the address of the account

	SALE_PATH         = "sale"
	SALE_DETAIL_PATH  = "sale/{id}"                   // {id} is a placeholder for the sale id
	SALE_BALANCE_PATH = "sale/{id}/balance/{address}" // {id} is a placeholder for the sale id, {address} is a placeholder for the address of the account
)

func init() {
	router = mux.NewRouter()
	router.HandleFunc(HOME_PATH, renderHomePage)
	router.HandleFunc(TOKEN_PATH, renderTokenPage)
	router.HandleFunc(TOKEN_DETAIL_PATH, renderTokenDetailPage)
	router.HandleFunc(TOKEN_BALANCE_PATH, renderTokenBalancePage)
	router.HandleFunc(AIRDROP_PATH, renderAirdropPage)
	router.HandleFunc(AIRDROP_DETAIL_PATH, renderAirdropDetailPage)
	router.HandleFunc(AIRDROP_CLAIM_CHECK_PATH, renderAirdropClaimCheckPage)
	router.HandleFunc(SALE_PATH, renderSalePage)
	router.HandleFunc(SALE_DETAIL_PATH, renderSaleDetailPage)
	router.HandleFunc(SALE_BALANCE_PATH, renderSaleBalancePage)
}

func renderTokenPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# 🪙 Tokens GRC20 Homepage 🪙\n")

	res.Write("A GRC20 token is a digital asset standard on the Gno Chain, similar to ERC20 tokens on Ethereum.\nIt defines a set of rules for creating and managing fungible tokens, ensuring compatibility across the Gno ecosystem.\n\n")
	res.Write("## Usage\n")
	res.Write("You can create your own token by referring to the help section in the documentation and using the NewToken function.\nAfter creating your token, you can manage it easily through the provided interface.\nTo view details of any token created by this factory, simply visit the page ``:token/{name}``, replacing ``{name}`` with the token's name.\n")

	res.Write("## 5 last tokens created\n")

	for _, tokenIDs := range lastTokensIDcreated {
		token := mustGetToken(tokenIDs)
		res.Write(ufmt.Sprintf("### Name: %s - Symbol: %s\n", token.banker.GetName(), token.banker.GetSymbol()))
		res.Write(ufmt.Sprintf("#### Total Supply: %d %s\n", token.banker.TotalSupply(), token.banker.GetSymbol()))
		res.Write(ufmt.Sprintf("#### Decimals: %d\n", token.banker.GetDecimals()))
		res.Write(ufmt.Sprintf("#### Admin: %s\n\n", token.admin.Owner().String()))
		res.Write(ufmt.Sprintf("> Link: [:token/%s](launchpad_grc20:token/%s)\n\n", tokenIDs, tokenIDs))
	}
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
	tokenName := req.GetVar("name")
	address := req.GetVar("address")
	token := mustGetToken(tokenName)
	balance := token.banker.BalanceOf(std.Address(address))

	res.Write("# 🪙 Token Balance 🪙\n")
	res.Write(ufmt.Sprintf("### 📍 Address: %s\n ### 🏦 Balance: %d %s\n", address, balance, token.banker.GetSymbol()))
}

func renderAirdropPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# 🎁 GRC20 Token Airdrops 🎁\n")

	res.Write("An airdrop is a distribution of GRC20 tokens to multiple wallet addresses, often as part of a promotional campaign or community incentive on the Gno Chain.\n")
	res.Write("Airdrops are commonly used to raise awareness, reward loyal users, or distribute tokens in a decentralized manner.\n\n")
	res.Write("## Usage\n")
	res.Write("You can create a new airdrop by referring to the help section in the documentation and using the NewAirdrop function.\n")
	res.Write("To participate in an airdrop, your addresses have to be included in the whitelist. Then you can claim your tokens.\n")
	res.Write("For more detailed information about a specific airdrop, including eligibility criteria and distribution details, visit the page ``:airdrop/{id}``, replacing ``{id}`` with the airdrop's unique identifier.\n")
	res.Write("## 5 last airdrops created\n")
	for i := nextAirdropID - 1; i > nextAirdropID-6; i-- {
		if i < 1 {
			break
		}
		airdrop := mustGetAirdrop(uint64(i))
		res.Write(ufmt.Sprintf("### Airdrop #%d\n", i))
		res.Write(ufmt.Sprintf("#### Token: %s\n", airdrop.token.banker.GetName()))
		if airdrop.isOnGoing() {
			res.Write("#### Status: Ongoing\n")
		} else {
			res.Write("#### Status: Ended\n")
		}
		if airdrop.startTimestamp > 0 {
			res.Write(ufmt.Sprintf("#### Start Date: %s\n", time.Unix(airdrop.startTimestamp, 0).Format("2006-01-02 15:04:05")))
		}
		if airdrop.endTimestamp > 0 {
			res.Write(ufmt.Sprintf("#### End Date: %s\n", time.Unix(airdrop.endTimestamp, 0).Format("2006-01-02 15:04:05")))
		}
		res.Write(ufmt.Sprintf("#### Amount to claim per address: %d\n", airdrop.amountPerAddr))
		res.Write(ufmt.Sprintf("#### Total addresses claimed: %d\n\n", airdrop.alreadyClaimed.Size()))
		res.Write(ufmt.Sprintf("> Link: [:airdrop/%d](launchpad_grc20:airdrop/%d)\n\n", i, i))
	}
}

func renderAirdropDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	airdropID, err := strconv.Atoi(req.GetVar("id"))
	if err != nil {
		panic("invalid airdrop ID")
	}
	airdrop := mustGetAirdrop(uint64(airdropID))

	res.Write(ufmt.Sprintf("# 🎁 Airdrop #%d Details 🎁\n", airdropID))

	res.Write(ufmt.Sprintf("### Token: %s\n", airdrop.token.banker.GetName()))
	if airdrop.isOnGoing() {
		res.Write("### Status: Ongoing\n")
	} else {
		res.Write("### Status: Ended\n")
	}
	if airdrop.startTimestamp > 0 {
		res.Write(ufmt.Sprintf("### Start Date: %s\n", time.Unix(airdrop.startTimestamp, 0).Format("2006-01-02 15:04:05")))
	}
	if airdrop.endTimestamp > 0 {
		res.Write(ufmt.Sprintf("### End Date: %s\n", time.Unix(airdrop.endTimestamp, 0).Format("2006-01-02 15:04:05")))
	}
	res.Write(ufmt.Sprintf("### Amount to claim per address: %d\n", airdrop.amountPerAddr))
	res.Write(ufmt.Sprintf("### Merkle Root: %s\n", airdrop.merkleRoot))
	res.Write(ufmt.Sprintf("### Total addresses claimed: %d\n\n", airdrop.alreadyClaimed.Size()))

	res.Write("## Claim Instructions\n")
	res.Write("To try to claim your tokens, call the claim function with the airdrop ID and the proof of your address.\n")
	res.Write("If you are eligible, you will receive the tokens in your wallet.\n")
}

func renderAirdropClaimCheckPage(res *mux.ResponseWriter, req *mux.Request) {
	airdropID, err := strconv.Atoi(req.GetVar("id"))
	if err != nil {
		panic("invalid airdrop ID")
	}
	address := req.GetVar("address")
	airdrop := mustGetAirdrop(uint64(airdropID))

	res.Write(ufmt.Sprintf("# 🎁 Airdrop #%d Claim Check 🎁\n", airdropID))
	res.Write(ufmt.Sprintf("### Address: %s\n", address))
	res.Write(ufmt.Sprintf("### Amount to claim: %d\n", airdrop.amountPerAddr))
	if airdrop.hasAlreadyClaimed(std.Address(address)) {
		res.Write("### Address already claimed\n")
		return
	} else {
		res.Write("### Address not yet claimed or not eligible\n")
	}
}

func renderSalePage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# 🛒 GRC20 Token Sales 🛒\n")

	res.Write("A token sale is a public or private fundraising event where a new GRC20 token is offered to the public at a fixed price.\n")
	res.Write("Sales can be used to raise capital for a project, distribute tokens to a wide audience, or establish a market value for the token.\n\n")
	res.Write("## Usage\n")
	res.Write("You can create a new sale by referring to the help section in the documentation and using the NewSale function.\n")
	res.Write("To participate in a token sale, you can buy tokens at the specified price during the sale period. if the sale if private your addr have to be included in the whitelist\n")
	res.Write("For more detailed information about a specific sale, including the price per token, sale limits, and goals, visit the page ``:sale/{id}``, replacing ``{id}`` with the sale's unique identifier.\n")

	res.Write("## 5 last sales created\n")
	for i := nextSaleID - 1; i > nextSaleID-6; i-- {
		if i < 1 {
			break
		}
		sale := mustGetSale(uint64(i))
		res.Write(ufmt.Sprintf("### Sale #%d\n", i))
		res.Write(ufmt.Sprintf("#### Token: %s\n", sale.token.banker.GetName()))
		if sale.isOnGoing() {
			res.Write("#### Status: Ongoing\n")
		} else {
			res.Write("#### Status: Not Started or Ended\n")
		}
		if sale.startTimestamp > 0 {
			res.Write(ufmt.Sprintf("#### Start Date: %s\n", time.Unix(sale.startTimestamp, 0).Format("2006-01-02 15:04:05")))
		}
		if sale.endTimestamp > 0 {
			res.Write(ufmt.Sprintf("#### End Date: %s\n", time.Unix(sale.endTimestamp, 0).Format("2006-01-02 15:04:05")))
		}
		if sale.merkleRoot != "" {
			res.Write("#### Sale is private\n")
		} else {
			res.Write("#### Sale is public\n")
		}
		res.Write(ufmt.Sprintf("#### Price per token: %d $GNOT\n", sale.pricePerToken))
		res.Write(ufmt.Sprintf("#### Limit per address: %d $%s\n", sale.limitPerAddr, sale.token.banker.GetSymbol()))
		res.Write(ufmt.Sprintf("#### Min goal: %d $GNOT\n", sale.minGoal))
		res.Write(ufmt.Sprintf("#### Max goal: %d $GNOT\n", sale.maxGoal))
		res.Write(ufmt.Sprintf("#### Already sold: %d $GNOT\n\n", sale.alreadySold))
		res.Write(ufmt.Sprintf("> Link: [:sale/%d](launchpad_grc20:sale/%d)\n\n", i, i))
	}
}

func renderSaleDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	saleID, err := strconv.Atoi(req.GetVar("id"))
	if err != nil {
		panic("invalid sale ID")
	}
	sale := mustGetSale(uint64(saleID))

	res.Write(ufmt.Sprintf("# 🛒 Sale #%d Details 🛒\n", saleID))

	res.Write(ufmt.Sprintf("### Token: %s\n", sale.token.banker.GetName()))
	if sale.isOnGoing() {
		res.Write("### Status: Ongoing\n")
	} else {
		res.Write("### Status: Not Started or Ended\n")
	}
	if sale.startTimestamp > 0 {
		res.Write(ufmt.Sprintf("### Start Date: %s\n", time.Unix(sale.startTimestamp, 0).Format("2006-01-02 15:04:05")))
	}
	if sale.endTimestamp > 0 {
		res.Write(ufmt.Sprintf("### End Date: %s\n", time.Unix(sale.endTimestamp, 0).Format("2006-01-02 15:04:05")))
	}
	if sale.merkleRoot != "" {
		res.Write("### Sale is private\n")
	} else {
		res.Write("### Sale is public\n")
	}
	res.Write(ufmt.Sprintf("### Price per token: %d $GNOT\n", sale.pricePerToken))
	res.Write(ufmt.Sprintf("### Limit per address: %d $%s\n", sale.limitPerAddr, sale.token.banker.GetSymbol()))
	res.Write(ufmt.Sprintf("### Min goal: %d $GNOT\n", sale.minGoal))
	res.Write(ufmt.Sprintf("### Max goal: %d $GNOT\n", sale.maxGoal))
	res.Write(ufmt.Sprintf("### Already sold: %d $GNOT\n\n", sale.alreadySold))

	res.Write("## Buy Instructions\n")
	res.Write("To participate in the sale, call the buy function with the sale ID and the amount of tokens you want to buy.\n")
	res.Write("If the sale is ongoing and you meet the criteria, you will receive the tokens in your wallet.\n")
}

func renderSaleBalancePage(res *mux.ResponseWriter, req *mux.Request) {
	saleID, err := strconv.Atoi(req.GetVar("id"))
	if err != nil {
		panic("invalid sale ID")
	}
	address := req.GetVar("address")
	sale := mustGetSale(uint64(saleID))
	balance := sale.BalanceOf(std.Address(address))

	res.Write("# 🛒 Sale Balance 🛒\n")
	res.Write(ufmt.Sprintf("### 🛒 Sale ID: %d\n", saleID))
	res.Write(ufmt.Sprintf("### 📍 Address: %s\n ### 🏦 Balance (Tokens from this sale only): %d %s\n", address, balance, sale.token.banker.GetSymbol()))

	res.Write("> ⚠️ *The tokens will be transfered or refunded after the sale ends depending if the sale reached the min goal or not* ⚠️\n")
}

func renderHomePage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write("# Welcome to the GRC20 Launchpad\n This is a platform for launching GRC20 tokens and managing airdrops.\n You can create a new token, mint and burn tokens, and create airdrops and sales periods. \n\n## Available Actions\n- [:token](launchpad_grc20:token)\n- [:airdrop](launchpad_grc20:airdrop)\n- [:sale](launchpad_grc20:sale)\n\n\n*Note: An enhanced user interface is available on [Teritori](https://teritori.com/)*\n")
}

func Render(path string) string {
	return router.Render(path)
}
