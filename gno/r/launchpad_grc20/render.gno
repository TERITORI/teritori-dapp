package launchpad_grc20

import (
	"std"
	"strings"

	"gno.land/p/demo/ufmt"
)

// TODO: Handle render of Airdrop too
// Idea is to first indicate the kind of render /airdrop, /token, /sale, etc. and then render the specific page
// Each render function should return a string that will be rendered as Markdown
func Render(path string) string {
	parts := strings.Split(path, "/")
	c := len(parts)

	switch {
	case path == "":
		return "# Welcome to the GRC20 Launchpad\n This is a platform for launching GRC20 tokens and managing airdrops.\n You can create a new token, mint and burn tokens, and create airdrops and sales periods. \n\n## Available Actions\n- /token\n- /airdrop\n- /sales\n\n\n*Note: An enhanced user interface is available on [Teritori](https://teritori.com/)*\n"
	case c == 1:
		name := parts[0]
		inst := mustGetToken(name)
		return inst.banker.RenderHome()
	case c == 3 && parts[1] == "balance":
		name := parts[0]
		inst := mustGetToken(name)
		owner := std.Address(parts[2])
		balance := inst.Token().BalanceOf(owner)
		return ufmt.Sprintf("%d", balance)
	default:
		return "404\n"
	}
}
