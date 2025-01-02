import { GnoDAOConfig } from "./deploy";
import { mustGetGnoNetwork } from "../../networks";

// TODO: Allow the role modules to be optional and don't use in MembershipDAO
export const generateMembershipDAOSource = (
  networkId: string,
  conf: GnoDAOConfig,
) => {
  const network = mustGetGnoNetwork(networkId);
  return `package ${conf.name}

  import (
    "std"
    "time"

    dao_core "${network.daoCorePkgPath}"
    dao_interfaces "${network.daoInterfacesPkgPath}"
    proposal_single "${network.daoProposalSinglePkgPath}"
    "${network.daoUtilsPkgPath}"
    "${network.profilePkgPath}"
    voting_group "${network.votingGroupPkgPath}"
    "${network.daoRegistryPkgPath}"
    "${network.socialFeedsPkgPath}"
  )
  
  var (
    daoCore    dao_interfaces.IDAOCore
    group      *voting_group.VotingGroup
    registered bool
  )

  func init() {
    votingModuleFactory := func(core dao_interfaces.IDAOCore) dao_interfaces.IVotingModule {
      group = voting_group.NewVotingGroup()
        ${conf.initialMembers
          .map(
            (member) =>
              `group.SetMemberPower("${member.address}", ${member.weight})`,
          )
          .join("\n\t")}
      return group
    }

    // TODO: consider using factories that return multiple modules and handlers

    proposalModulesFactories := []dao_interfaces.ProposalModuleFactory{
      func(core dao_interfaces.IDAOCore) dao_interfaces.IProposalModule {
        tt := proposal_single.PercentageThresholdPercent(${Math.ceil(
          conf.thresholdPercent * 100,
        )}) // ${Math.ceil(conf.thresholdPercent * 100) / 100}%
        tq := proposal_single.PercentageThresholdPercent(${Math.ceil(
          conf.quorumPercent * 100,
        )}) // ${Math.ceil(conf.quorumPercent * 100) / 100}%
        return proposal_single.NewDAOProposalSingle(core, &proposal_single.DAOProposalSingleOpts{
          MaxVotingPeriod: dao_utils.DurationTime(time.Second * ${conf.maxVotingPeriodSeconds}),
          Threshold: &proposal_single.ThresholdThresholdQuorum{
            Threshold: &tt,
            Quorum:    &tq,
          },
        })
      },
    }
    
    messageHandlersFactories := []dao_interfaces.MessageHandlerFactory{
      func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
        return group.UpdateMembersHandler()
      },
      func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
        // TODO: add a router to support multiple proposal modules
        propMod := core.ProposalModules()[0]
        return proposal_single.NewUpdateSettingsHandler(propMod.Module.(*proposal_single.DAOProposalSingle))
      },
      func(core dao_interfaces.IDAOCore) dao_interfaces.MessageHandler {
        return social_feeds.NewCreatePostHandler()
      },
    }

    daoCore = dao_core.NewDAOCore(votingModuleFactory, proposalModulesFactories, messageHandlersFactories)

    // Register the DAO profile
    profile.SetStringField(profile.DisplayName, "${conf.displayName}")
    profile.SetStringField(profile.Bio, "${conf.description}")
    profile.SetStringField(profile.Avatar, "${conf.imageURI}")

    dao_registry.Register(func() dao_interfaces.IDAOCore { return daoCore }, "${conf.displayName}", "${conf.description}", "membership", "${conf.imageURI}")
  }
  
  func Render(path string) string {
    return daoCore.Render(path)
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

  func ProposeJSON(moduleIndex int, proposalJSON string) int {
    // move check in dao core
    module := dao_core.GetProposalModule(daoCore, moduleIndex)
    if !module.Enabled {
      panic("proposal module is not enabled")
    }

    return module.Module.ProposeJSON(proposalJSON)
  }

  func getProposalsJSON(moduleIndex int, limit int, startAfter string, reverse bool) string {
    // move logic in dao core
    module := dao_core.GetProposalModule(daoCore, moduleIndex)
    return module.Module.ProposalsJSON(limit, startAfter, reverse)
  }

  func getProposalJSON(moduleIndex int, proposalIndex int) string {
    // move logic in dao core
    module := dao_core.GetProposalModule(daoCore, moduleIndex)
    return module.Module.ProposalJSON(proposalIndex)
  }

  func getMembersJSON(start, end string, limit uint64) string {
    return daoCore.VotingModule().GetMembersJSON(start, end, limit, std.GetHeight())
  }
`;
};
