import { mustGetGnoNetwork } from "../../networks";
import { adenaAddPkg } from "../gno";

interface GnoDAOMember {
  address: string;
  weight: number;
}

interface GnoDAOConfig {
  name: string;
  maxVotingPeriodSeconds: number;
  initialMembers: GnoDAOMember[];
  thresholdPercent: number;
  quorumPercent: number;
  displayName: string;
  description: string;
  imageURI: string;
}

const generateDAORealmSource = (networkId: string, conf: GnoDAOConfig) => {
  const network = mustGetGnoNetwork(networkId);
  return `package ${conf.name}

  import (
    "time"

    dao_core "${network.daoCorePkgPath}"
    dao_interfaces "${network.daoInterfacesPkgPath}"
    proposal_single "${network.daoProposalSinglePkgPath}"
    voting_group "${network.votingGroupPkgPath}"
    "${network.groupsPkgPath}"
    modboards "${network.modboardsPkgPath}"
    "${network.daoRegistryPkgPath}"
  )
  
  var (
    daoCore       dao_interfaces.IDAOCore
    mainBoardName = "${conf.name}"
    groupName     = mainBoardName + "_voting_group"
    groupID       groups.GroupID
  )
  
  func init() {
    modboards.CreateBoard(mainBoardName)
  
    votingModuleFactory := func(core dao_interfaces.IDAOCore) dao_interfaces.IVotingModule {
      groupID = groups.CreateGroup(groupName)
      ${conf.initialMembers
        .map(
          (member) =>
            `groups.AddMember(groupID, "${member.address}", ${member.weight}, "");`,
        )
        .join("\n\t")}
      return voting_group.NewVotingGroup(groupID)
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
          MaxVotingPeriod: time.Second * ${conf.maxVotingPeriodSeconds},
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

    dao_registry.Register(${JSON.stringify(conf.displayName)}, ${JSON.stringify(
      conf.description,
    )}, ${JSON.stringify(conf.imageURI)})
  }
  
  func Render(path string) string {
    return "[[board](/r/demo/modboards:" + mainBoardName + ")]\\n\\n" + daoCore.Render(path)
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
`;
};

export const adenaDeployGnoDAO = async (
  networkId: string,
  creator: string,
  conf: GnoDAOConfig,
) => {
  const source = generateDAORealmSource(networkId, conf);
  const pkgPath = `gno.land/r/demo/${conf.name}`;
  await adenaAddPkg(
    networkId,
    {
      creator,
      deposit: "1ugnot",
      package: {
        Name: conf.name,
        Path: pkgPath,
        Files: [{ Name: `${conf.name}.gno`, Body: source }],
      },
    },
    { gasWanted: 10000000 },
  );
  return pkgPath;
};
