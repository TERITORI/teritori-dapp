package basedao

import (
	"std"
	"strings"

	"gno.land/p/demo/mux"
	"gno.land/p/demo/seqid"
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daokit"
)

const (
	HOME_PATH             = ""
	CONFIG_PATH           = "config"
	PROPOSAL_HISTORY_PATH = "history"
	MEMBER_DETAIL_PATH    = "member/{address}"
	PROPOSAL_DETAIL_PATH  = "proposal/{id}"
)

func (d *DAO) initRenderingRouter() {
	d.RenderRouter.HandleFunc(HOME_PATH, d.renderHomePage)
	d.RenderRouter.HandleFunc(CONFIG_PATH, d.renderConfigPage)
	d.RenderRouter.HandleFunc(PROPOSAL_HISTORY_PATH, d.renderProposalHistoryPage)
	d.RenderRouter.HandleFunc(MEMBER_DETAIL_PATH, d.renderMemberDetailPage)
	d.RenderRouter.HandleFunc(PROPOSAL_DETAIL_PATH, d.renderProposalDetailPage)
}

func (d *DAO) Render(path string) string {
	return d.RenderRouter.Render(path)
}

func (d *DAO) renderHomePage(res *mux.ResponseWriter, req *mux.Request) {
	name := d.GetProfileString(d.Realm.Addr(), "DisplayName", "DAO")
	description := d.GetProfileString(d.Realm.Addr(), "Bio", "Created with daokit")
	pkgPath := d.Realm.PkgPath()
	linkPath := ""
	slashIdx := strings.IndexRune(pkgPath, '/')
	if slashIdx != 1 {
		linkPath = pkgPath[slashIdx:]
	}

	res.Write(ufmt.Sprintf("# %s - %s\n\n", name, std.CurrentRealm().Addr().String()))
	res.Write(ufmt.Sprintf("> Description: %s\n\n", description))
	res.Write(ufmt.Sprintf("Discover more about this DAO on the [configuration page ⚙️](%s:%s)\n\n", linkPath, CONFIG_PATH))

	res.Write(ufmt.Sprintf("## Members 👤 \n\n"))
	i := 1
	d.Members.members.Iterate("", "", func(key string, value interface{}) bool {
		res.Write(ufmt.Sprintf("- **Member %d: [%s](%s:%s/%s)**\n\n", i, key, linkPath, "member", key))
		i += 1
		return false
	})

	res.Write(ufmt.Sprintf("> You can find more information about a member by clicking on their address\n\n"))
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))

	res.Write(ufmt.Sprintf("## Running Proposals 🗳️\n\n"))
	i = 0
	d.Core.ProposalModule.Proposals.Iterate("", "", func(key string, value interface{}) bool {
		proposal := value.(*daokit.Proposal)
		if proposal.Status != daokit.ProposalStatusOpen {
			return false
		}
		id, err := seqid.FromString(key)
		if err != nil {
			panic(err)
		}
		res.Write(ufmt.Sprintf("- **Proposal %d: [%s](%s:%s/%s)**\n\n", uint64(id), proposal.Title, linkPath, "proposal", key))
		i += 1
		return false
	})
	if i == 0 {
		res.Write(ufmt.Sprintf("\t⚠️ There are no running proposals at the moment\n\n"))
	}

	res.Write(ufmt.Sprintf("> See the [proposal history 📜](%s:%s) for more information\n\n", linkPath, PROPOSAL_HISTORY_PATH))
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("[Add a new proposal 🗳️](%s$help)\n\n", linkPath))
}

func (d *DAO) renderConfigPage(res *mux.ResponseWriter, req *mux.Request) {
	name := d.GetProfileString(d.Realm.Addr(), "DisplayName", "DAO")

	res.Write(ufmt.Sprintf("# %s - Config ⚙️\n\n", name))
	roles := d.Members.GetRoles()
	res.Write(ufmt.Sprintf("## Roles 🏷️\n\n"))
	for _, role := range roles {
		res.Write(ufmt.Sprintf("- %s\n\n", role))
	}
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("## Resources 📦\n\n"))
	i := 1
	d.Core.Resources.Resources.Iterate("", "", func(key string, value interface{}) bool {
		resource := value.(*daokit.Resource)
		res.Write(ufmt.Sprintf("- **Resource #%d: %s**\n\n", i, key))
		// TODO: add doc to handler and print here
		res.Write(ufmt.Sprintf("  - **Condition:** %s\n\n", resource.Condition.Render()))
		i += 1
		return false
	})
}

func (d *DAO) renderProposalHistoryPage(res *mux.ResponseWriter, req *mux.Request) {
	name := d.GetProfileString(d.Realm.Addr(), "DisplayName", "DAO")
	pkgPath := d.Realm.PkgPath()
	linkPath := ""
	slashIdx := strings.IndexRune(pkgPath, '/')
	if slashIdx != 1 {
		linkPath = pkgPath[slashIdx:]
	}

	res.Write(ufmt.Sprintf("# %s - Proposal History\n\n", name))
	res.Write(ufmt.Sprintf("## Proposals 🗳️\n\n"))
	i := 1
	d.Core.ProposalModule.Proposals.Iterate("", "", func(key string, value interface{}) bool {
		proposal := value.(*daokit.Proposal)
		id, err := seqid.FromString(key)
		if err != nil {
			panic(err)
		}
		res.Write(ufmt.Sprintf("- **Proposal %d: [%s](%s:%s/%s) - %s**\n\n", uint64(id), proposal.Title, linkPath, "proposal", key, proposal.Status))
		i += 1
		return false
	})
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("[Add a new proposal 🗳️](%s$help)\n\n", linkPath))
}

func (d *DAO) renderMemberDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	name := d.GetProfileString(d.Realm.Addr(), "DisplayName", "DAO")

	res.Write(ufmt.Sprintf("# %s - Member Detail - %s\n\n", name, req.GetVar("address")))
	roles := d.Members.GetMemberRoles(req.GetVar("address"))
	res.Write(ufmt.Sprintf("## Roles 🏷️\n\n"))
	for _, role := range roles {
		res.Write(ufmt.Sprintf("- %s\n\n", role))
	}
}

func (d *DAO) renderProposalDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	name := d.GetProfileString(d.Realm.Addr(), "DisplayName", "DAO")
	pkgPath := d.Realm.PkgPath()
	linkPath := ""
	slashIdx := strings.IndexRune(pkgPath, '/')
	if slashIdx != 1 {
		linkPath = pkgPath[slashIdx:]
	}

	id, err := seqid.FromString(req.GetVar("id"))
	if err != nil {
		panic(err)
	}
	res.Write(ufmt.Sprintf("# %s - Proposal #%d\n\n", name, uint64(id)))
	proposal := d.Core.ProposalModule.GetProposal(uint64(id))
	res.Write(ufmt.Sprintf("## Title - %s 📜\n\n", proposal.Title))
	res.Write(ufmt.Sprintf("## Description 📝\n\n%s\n\n", proposal.Description))
	res.Write(ufmt.Sprintf("## Resource - %s 📦\n\n", proposal.Message.Type()))
	res.Write(proposal.Message.String())
	if proposal.Status == daokit.ProposalStatusOpen {
		res.Write(ufmt.Sprintf("## Status - Open 🟡\n\n"))
		res.Write(ufmt.Sprintf("[Vote on this proposal 🗳️](%s$help)\n\n", linkPath))
	} else if proposal.Status == daokit.ProposalStatusPassed {
		res.Write(ufmt.Sprintf("## Status - Passed 🟢\n\n"))
		res.Write(ufmt.Sprintf("[Execute this proposal 🗳️](%s$help)\n\n", linkPath))
	} else if proposal.Status == daokit.ProposalStatusExecuted {
		res.Write(ufmt.Sprintf("## Status - Executed ✅\n\n"))
	} else {
		res.Write(ufmt.Sprintf("## Status - Closed 🔴\n\n"))
	}
	res.Write(ufmt.Sprintf("> proposed by %s 👤\n\n", proposal.ProposerID))

	res.Write(ufmt.Sprintf("\n--------------------------------\n"))

	res.Write(ufmt.Sprintf("## Votes 🗳️\n\n"))
	res.Write(ufmt.Sprintf("%s\n\n", proposal.ConditionState.RenderJSON(proposal.Votes)))
}
