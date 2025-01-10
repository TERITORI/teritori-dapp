package dao_roles_based

import (
	"std"
	"strings"

	"gno.land/p/demo/ufmt"
	"gno.land/p/teritori/daocond"
)

func (d *DaoRolesBased) Render() string {
	sb := strings.Builder{}
	sb.WriteString((ufmt.Sprintf("# Decentralized Autonomous Organization (DAO) Roles Based\n\n")))
	sb.WriteString(d.MemberModule.Render())
	sb.WriteString(d.ResourcesModule.Render())
	sb.WriteString(d.ProposalModule.Render())
	sb.WriteString(d.MessagesRegistry.Render())
	return sb.String()
}

func (m *MemberModule) Render() string {
	sb := strings.Builder{}
	sb.WriteString((ufmt.Sprintf("## Members\n\n")))

	i := 1
	m.members.Iterate("", "", func(key string, value interface{}) bool {
		sb.WriteString((ufmt.Sprintf("**Member %d: %s**\n\n", i, key)))
		sb.WriteString((ufmt.Sprintf("Roles:\n\n")))
		roles := m.roleManager.GetUserRoles(std.Address(key))
		for _, role := range roles {
			sb.WriteString((ufmt.Sprintf("- %s\n\n", role)))
		}
		sb.WriteString((ufmt.Sprintf("\n--------------------------------\n")))
		i += 1
		return false
	})
	return sb.String()
}

func (r *ResourcesModule) Render() string {
	sb := strings.Builder{}
	sb.WriteString((ufmt.Sprintf("## Resources\n\n")))

	r.resources.Iterate("", "", func(key string, value interface{}) bool {
		condition := value.(daocond.Condition)
		sb.WriteString((ufmt.Sprintf("**Resource: %s**\n\n", key)))
		sb.WriteString((ufmt.Sprintf("Condition: %s\n", condition.Render())))
		sb.WriteString((ufmt.Sprintf("\n--------------------------------\n")))
		return false
	})

	return sb.String()
}

func (p *ProposalModule) Render() string {
	sb := strings.Builder{}
	sb.WriteString((ufmt.Sprintf("## Proposals\n\n")))

	i := 1
	p.proposals.Iterate("", "", func(key string, value interface{}) bool {
		proposal := value.(*Proposal)
		sb.WriteString((ufmt.Sprintf("**Proposal %d: %s**\n\n", i, proposal.title)))
		sb.WriteString((ufmt.Sprintf("Description: %s\n\n", proposal.description)))
		sb.WriteString((ufmt.Sprintf("Proposer: %s\n\n", proposal.proposer)))
		sb.WriteString((ufmt.Sprintf("Status: %s\n\n", proposal.status.String())))
		sb.WriteString((ufmt.Sprintf("State: %s\n\n", proposal.state.RenderJSON(proposal.votes).String())))
		sb.WriteString((ufmt.Sprintf("\n--------------------------------\n")))
		i += 1
		return false
	})

	return sb.String()
}

func (mr *MessagesRegistry) Render() string {
	sb := strings.Builder{}
	sb.WriteString((ufmt.Sprintf("## Supported Messages\n\n")))

	mr.handlers.Iterate("", "", func(key string, value interface{}) bool {
		sb.WriteString((ufmt.Sprintf("- %s\n", value.(MessageHandler).Type())))
		return false
	})

	return sb.String()
}
