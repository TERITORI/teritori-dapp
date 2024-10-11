package test

import (
	dao_core "gno.land/p/teritori/dao_core"
	dao_interfaces "gno.land/p/teritori/dao_interfaces"
	proposal_single "gno.land/p/teritori/dao_proposal_single"
	voting_group "gno.land/p/teritori/dao_voting_group"
	"gno.land/r/teritori/dao_registry"
	"gno.land/r/teritori/groups"
)

var (
	daoCore       dao_interfaces.IDAOCore
	mainBoardName = "test"
	groupName     = mainBoardName + "_voting_group"
	groupID       groups.GroupID
)

func init() {
	modboards.CreateBoard(mainBoardName)

	votingModuleFactory := func(core dao_interfaces.IDAOCore) dao_interfaces.IVotingModule {
		groupID = groups.CreateGroup(groupName)
		groups.AddMember(groupID, "g16jv3rpz7mkt0gqulxas56se2js7v5vmc6n6e0r", 1, "")
		return voting_group.NewVotingGroup(groupID)
	}

	// TODO: consider using factories that return multiple modules and handlers

	proposalModulesFactories := []dao_interfaces.ProposalModuleFactory{
		func(core dao_interfaces.IDAOCore) dao_interfaces.IProposalModule {
			tt := proposal_single.PercentageThresholdPercent(1500) // 15%
			tq := proposal_single.PercentageThresholdPercent(5000) // 50%
			return proposal_single.NewDAOProposalSingle(core, &proposal_single.DAOProposalSingleOpts{
				MaxVotingPeriod: 60 * 86400,
				Threshold: &proposal_single.ThresholdThresholdQuorum{
					Threshold: &tt,
					Quorum:    &tq,
				},
			})
		},
	}

	messageHandlersFactories := []dao_interfaces.MessageHandlerFactory{
		func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
			return groups.NewAddMemberHandler()
		},
		func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
			return groups.NewDeleteMemberHandler()
		},
		func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
			// TODO: add a router to support multiple proposal modules
			propMod := core.ProposalModules()[0]
			return proposal_single.NewUpdateSettingsHandler(propMod.Module.(*proposal_single.DAOProposalSingle))
		},
		func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
			return modboards.NewCreateBoardHandler()
		},
		func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
			return modboards.NewDeletePostHandler()
		},
	}

	daoCore = dao_core.NewDAOCore(votingModuleFactory, proposalModulesFactories, messageHandlersFactories)

	dao_registry.Register("Test", "Test Dao description", "https://images.unsplash.com/photo-1492571350019-22de08371fd3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
}

func Render(path string) string {
	return "[[board](/r/demo/modboards:" + mainBoardName + ")]\n\n" + daoCore.Render(path)
}

func VoteJSON(moduleIndex int, proposalID int, voteJSON string) {
	// move check in dao core
	module := dao_core.GetProposalModule(daoCore, moduleIndex)
	if !module.Enabled {
		panic("proposal module is not enabled")
	}
	module.Module.VoteJSON(proposalID, voteJSON)
}

func Execute(moduleIndex int, proposalID int) {
	// move check in dao core
	module := dao_core.GetProposalModule(daoCore, moduleIndex)
	if !module.Enabled {
		panic("proposal module is not enabled")
	}
	module.Module.Execute(proposalID)
}

func ProposeJSON(moduleIndex int, proposalJSON string) {
	// move check in dao core
	module := dao_core.GetProposalModule(daoCore, moduleIndex)
	if !module.Enabled {
		panic("proposal module is not enabled")
	}
	module.Module.ProposeJSON(proposalJSON)
}

func getProposalsJSON(moduleIndex int, limit int, startAfter string, reverse bool) string {
	// move logic in dao core
	module := dao_core.GetProposalModule(daoCore, moduleIndex)
	return module.Module.ProposalsJSON(limit, startAfter, reverse)
}
