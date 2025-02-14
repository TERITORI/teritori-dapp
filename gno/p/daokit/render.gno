package daokit

import (
	"std"

	"gno.land/p/demo/mux"
	"gno.land/p/demo/seqid"
	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daocond"
)

const (
	HOME_PATH             = ""
	CONFIG_PATH           = "config"
	PROPOSAL_HISTORY_PATH = "history"
	MEMBER_DETAIL_PATH    = "member/{address}"
	PROPOSAL_DETAIL_PATH  = "proposal/{id}"
)

func (d *DAO) initRenderingRouter() {
	d.renderingRouter.HandleFunc(HOME_PATH, d.renderHomePage)
	d.renderingRouter.HandleFunc(CONFIG_PATH, d.renderConfigPage)
	d.renderingRouter.HandleFunc(PROPOSAL_HISTORY_PATH, d.renderProposalHistoryPage)
	d.renderingRouter.HandleFunc(MEMBER_DETAIL_PATH, d.renderMemberDetailPage)
	d.renderingRouter.HandleFunc(PROPOSAL_DETAIL_PATH, d.renderProposalDetailPage)
}

func (d *DAO) Render(path string) string {
	return d.renderingRouter.Render(path)
}

func (d *DAO) renderHomePage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write(ufmt.Sprintf("# %s - %s\n\n", d.Name, std.CurrentRealm().Addr().String()))
	res.Write(ufmt.Sprintf("> Description: %s\n\n", d.Description))
	res.Write(ufmt.Sprintf("Discover more about this DAO on the [configuration page ⚙️](%s:%s)\n\n", d.realmName, CONFIG_PATH))

	res.Write(ufmt.Sprintf("## Members 👤 \n\n"))
	i := 1
	d.MemberModule.members.Iterate("", "", func(key string, value interface{}) bool {
		res.Write(ufmt.Sprintf("- **Member %d: [%s](%s:%s/%s)**\n\n", i, key, d.realmName, "member", key))
		i += 1
		return false
	})

	res.Write(ufmt.Sprintf("> You can find more information about a member by clicking on their address\n\n"))
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))

	res.Write(ufmt.Sprintf("## Running Proposals 🗳️\n\n"))
	i = 0
	d.ProposalModule.proposals.Iterate("", "", func(key string, value interface{}) bool {
		proposal := value.(*Proposal)
		if proposal.status != ProposalStatusOpen {
			return false
		}
		id, err := seqid.FromString(key)
		if err != nil {
			panic(err)
		}
		res.Write(ufmt.Sprintf("- **Proposal %d: [%s](%s:%s/%s)**\n\n", uint64(id), proposal.title, d.realmName, "proposal", key))
		i += 1
		return false
	})
	if i == 0 {
		res.Write(ufmt.Sprintf("\t⚠️ There are no running proposals at the moment\n\n"))
	}

	res.Write(ufmt.Sprintf("> See the [proposal history 📜](%s:%s) for more information\n\n", d.realmName, PROPOSAL_HISTORY_PATH))
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("[Add a new proposal 🗳️](%s$help)\n\n", d.realmName))
}

func (d *DAO) renderConfigPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write(ufmt.Sprintf("# %s - Config ⚙️\n\n", d.Name))
	roles := d.MemberModule.GetRoles()
	res.Write(ufmt.Sprintf("## Roles 🏷️\n\n"))
	for _, role := range roles {
		res.Write(ufmt.Sprintf("- %s\n\n", role))
	}
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("## Resources 📦\n\n"))
	i := 1
	d.ResourcesModule.resources.Iterate("", "", func(key string, value interface{}) bool {
		resource := value.(daocond.Condition)
		res.Write(ufmt.Sprintf("- **Resource #%d: %s**\n\n", i, key))
		res.Write(ufmt.Sprintf("  - **Condition:** %s\n\n", resource.Render()))
		i += 1
		return false
	})
}

func (d *DAO) renderProposalHistoryPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write(ufmt.Sprintf("# %s - Proposal History\n\n", d.Name))
	res.Write(ufmt.Sprintf("## Proposals 🗳️\n\n"))
	i := 1
	d.ProposalModule.proposals.Iterate("", "", func(key string, value interface{}) bool {
		proposal := value.(*Proposal)
		id, err := seqid.FromString(key)
		if err != nil {
			panic(err)
		}
		res.Write(ufmt.Sprintf("- **Proposal %d: [%s](%s:%s/%s) - %s**\n\n", uint64(id), proposal.title, d.realmName, "proposal", key, proposal.status))
		i += 1
		return false
	})
	res.Write(ufmt.Sprintf("\n--------------------------------\n"))
	res.Write(ufmt.Sprintf("[Add a new proposal 🗳️](%s$help)\n\n", d.realmName))
}

func (d *DAO) renderMemberDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	res.Write(ufmt.Sprintf("# %s - Member Detail - %s\n\n", d.Name, req.GetVar("address")))
	roles := d.MemberModule.GetMemberRoles(req.GetVar("address"))
	res.Write(ufmt.Sprintf("## Roles 🏷️\n\n"))
	for _, role := range roles {
		res.Write(ufmt.Sprintf("- %s\n\n", role))
	}
}

func (d *DAO) renderProposalDetailPage(res *mux.ResponseWriter, req *mux.Request) {
	id, err := seqid.FromString(req.GetVar("id"))
	if err != nil {
		panic(err)
	}
	res.Write(ufmt.Sprintf("# %s - Proposal #%d\n\n", d.Name, uint64(id)))
	proposal := d.ProposalModule.GetProposal(uint64(id))
	res.Write(ufmt.Sprintf("## Title - %s 📜\n\n", proposal.title))
	res.Write(ufmt.Sprintf("## Description 📝\n\n%s\n\n", proposal.description))
	res.Write(ufmt.Sprintf("## Resource - %s 📦\n\n", proposal.message.Type()))
	if proposal.status == ProposalStatusOpen {
		res.Write(ufmt.Sprintf("## Status - Open 🟡\n\n"))
		res.Write(ufmt.Sprintf("[Vote on this proposal 🗳️](%s$help)\n\n", d.realmName))
	} else if proposal.status == ProposalStatusPassed {
		res.Write(ufmt.Sprintf("## Status - Passed 🟢\n\n"))
		res.Write(ufmt.Sprintf("[Execute this proposal 🗳️](%s$help)\n\n", d.realmName))
	} else if proposal.status == ProposalStatusExecuted {
		res.Write(ufmt.Sprintf("## Status - Executed ✅\n\n"))
	} else {
		res.Write(ufmt.Sprintf("## Status - Closed 🔴\n\n"))
	}
	res.Write(ufmt.Sprintf("> proposed by %s 👤\n\n", proposal.proposer))

	res.Write(ufmt.Sprintf("\n--------------------------------\n"))

	res.Write(ufmt.Sprintf("## Votes 🗳️\n\n"))
	res.Write(ufmt.Sprintf("%s\n\n", proposal.conditionState.RenderJSON(proposal.votes)))
}
