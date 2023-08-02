import { adenaAddPkg } from "../gno";

export interface GnoDAOMember {
  address: string;
  weight: number;
}

export interface GnoDAOConfig {
  name: string;
  maxVotingPeriodSeconds: number;
  initialMembers: GnoDAOMember[];
  thresholdPercent: number;
  quorumPercent: number;
  displayName: string;
  description: string;
  imageURI: string;
}

export const generateDAORealmSource = (conf: GnoDAOConfig) => `package ${
  conf.name
}

import (
	"encoding/base64"
	"std"
	"strings"
	"time"

  dao_core "gno.land/p/demo/daodao/core_v3"
	dao_interfaces "gno.land/p/demo/daodao/interfaces_v3"
	"gno.land/p/demo/daodao/proposal_single_v4"
	"gno.land/p/demo/daodao/voting_group_v5"
	"gno.land/p/demo/jsonutil_v2"
	"gno.land/r/demo/groups_v6"
	modboards "gno.land/r/demo/modboards_v3"
  "gno.land/r/demo/dao_registry_v5"
)

var (
	daoCore       dao_core.IDAOCore
	registry      = dao_interfaces.NewMessagesRegistry()
	mainBoardName = "${conf.name}"
	groupID       groups.GroupID
)

func init() {
	groupID = groups.CreateGroup(mainBoardName)
	${conf.initialMembers
    .map(
      (member) =>
        `groups.AddMember(groupID, "${member.address}", ${member.weight}, "");`
    )
    .join("\n\t")}
	registry.Register(groups.NewAddMemberHandler())
	registry.Register(groups.NewDeleteMemberHandler())

	daoCore = dao_core.NewDAOCore(dao_voting_group.NewGRC4Voting(groupID), nil)

	tt := dao_interfaces.Percent(${Math.ceil(conf.thresholdPercent * 100)}) // ${
  Math.ceil(conf.thresholdPercent * 100) / 100
}%
	tq := dao_interfaces.Percent(${Math.ceil(conf.quorumPercent * 100)}) // ${
  Math.ceil(conf.quorumPercent * 100) / 100
}%
	proposalMod := dao_proposal_single.NewDAOProposalSingle(daoCore, &dao_proposal_single.DAOProposalSingleOpts{
		MaxVotingPeriod: time.Second * ${conf.maxVotingPeriodSeconds},
		Threshold: dao_interfaces.Threshold{ThresholdQuorum: &dao_interfaces.ThresholdQuorum{
			Threshold: dao_interfaces.PercentageThreshold{Percent: &tt},
			Quorum:    dao_interfaces.PercentageThreshold{Percent: &tq},
		}},
		Registry: registry,
	})
	// TODO: add a router to support multiple proposal modules
	registry.Register(dao_proposal_single.NewUpdateSettingsHandler(proposalMod))
	daoCore.AddProposalModule(proposalMod)

	registry.Register(modboards.NewCreateBoardHandler())
	registry.Register(modboards.NewDeletePostHandler())
	modboards.CreateBoard(mainBoardName)

  dao_registry.Register(${JSON.stringify(conf.displayName)}, ${JSON.stringify(
  conf.description
)}, ${JSON.stringify(conf.imageURI)})
}

func Render(path string) string {
	return "[[board](/r/demo/modboards:" + mainBoardName + ")]\\n\\n" + daoCore.Render(path)
}

func GetCore() dao_core.IDAOCore {
	return daoCore
}

func Vote(moduleIndex int, proposalID int, vote dao_interfaces.Vote, rationale string) {
	dao_core.GetProposalModule(daoCore, moduleIndex).Vote(proposalID, vote, rationale)
}

func Execute(moduleIndex int, proposalID int) {
	dao_core.GetProposalModule(daoCore, moduleIndex).Execute(proposalID)
}

func Propose(moduleIndex int, title string, description string, b64Messages string) {
	mod := dao_core.GetProposalModule(daoCore, moduleIndex)
	var messages []dao_interfaces.ExecutableMessage
	if len(b64Messages) != 0 {
		rawMessages := strings.Split(b64Messages, ",")
		for _, rawMessage := range rawMessages {
			message := registry.FromBase64String(rawMessage)
			messages = append(messages, message)
		}
	}
	mod.Propose(title, description, messages)
}

func GetBinaryMembers() string {
	members := groups.GetMembers(groupID)
	ss := []string{}
	for _, member := range members {
		ss = append(ss, base64.RawURLEncoding.EncodeToString(member.Bytes()))
	}
	return strings.Join(ss, ",")
}

func GetProposalsJSON(moduleIndex int) string {
	return jsonutil.FormatSlice(dao_core.GetProposalModule(daoCore, moduleIndex).Proposals())
}

func GetGroupID() uint64 {
  return uint64(groupID)
}
`;

export const adenaDeployGnoDAO = async (
  networkId: string,
  creator: string,
  conf: GnoDAOConfig
) => {
  const source = generateDAORealmSource(conf);
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
    { gasWanted: 10000000 }
  );
  return pkgPath;
};
