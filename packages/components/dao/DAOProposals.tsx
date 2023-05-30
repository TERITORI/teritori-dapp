import React, { useMemo, useState } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DAOProposalModal } from "./DAOProposalModal";
import { ProposalActions } from "./ProposalActions";
import orgSVG from "../../../assets/icons/multisig.svg";
import { ProposalResponse } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { useDAOProposalVotes } from "../../hooks/dao/useDAOProposalVotes";
import { useDAOProposals } from "../../hooks/dao/useDAOProposals";
import { useDAOProposalsConfig } from "../../hooks/dao/useDAOProposalsConfig";
import { useDAOTotalVotingPower } from "../../hooks/dao/useDAOTotalVotingPower";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { getUserId, parseUserId } from "../../networks";
import { trimFixed } from "../../utils/numbers";
import { neutral33, neutral55, neutral77 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";

export const DAOProposals: React.FC<{
  daoId: string | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ daoId, style }) => {
  const { daoProposals } = useDAOProposals(daoId);

  return (
    <View style={style}>
      {[...(daoProposals || [])].reverse().map((proposal) => (
        <ProposalRow daoId={daoId} key={proposal.id} proposal={proposal} />
      ))}
    </View>
  );
};

const ProposalRow: React.FC<{
  daoId: string | undefined;
  proposal: ProposalResponse;
}> = ({ daoId, proposal }) => {
  const [network] = parseUserId(daoId);
  const { daoProposalVotes } = useDAOProposalVotes(daoId, proposal.id);
  const { daoTotalVotingPower } = useDAOTotalVotingPower(daoId);
  const { daoProposalsConfig } = useDAOProposalsConfig(daoId);

  const halfGap = 24;
  const elemStyle: ViewStyle = {
    height: 32,
    justifyContent: "space-between",
    paddingHorizontal: halfGap,
    flex: 1,
  };

  const approvedWeight = useMemo(() => {
    if (!daoProposalVotes) {
      return 0;
    }
    return daoProposalVotes
      .filter((v) => v.vote === "yes")
      .reduce((total, v) => total + parseFloat(v.power), 0);
  }, [daoProposalVotes]);

  const totalWeight = parseFloat(daoTotalVotingPower?.power || "0");

  const requiredWeight = daoProposalsConfig?.threshold
    ? "threshold_quorum" in daoProposalsConfig.threshold
      ? parseFloat(
          "percent" in daoProposalsConfig.threshold.threshold_quorum.quorum
            ? daoProposalsConfig.threshold.threshold_quorum.quorum.percent
            : "0"
        ) * totalWeight
      : 0
    : 0;

  const [displayProposalModal, setDisplayProposalModal] =
    useState<boolean>(false);

  const progressBarHeight = 6;

  const proposerId = getUserId(network?.id, proposal.proposal.proposer);

  const { primaryAlias: proposerAlias } = useNSPrimaryAlias(proposerId);

  return (
    <View
      style={{
        flexDirection: "row",
        height: 64,
        alignItems: "center",
        borderBottomColor: neutral33,
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={[elemStyle, { paddingLeft: 0 }]}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              height: "100%",
            }}
          >
            <SVG
              source={orgSVG}
              width={32}
              height={32}
              style={{ marginRight: 12 }}
            />
            <View
              style={{
                height: "100%",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setDisplayProposalModal(true)}>
                <BrandText
                  style={[fontSemibold14, { lineHeight: 14 }]}
                  numberOfLines={1}
                >
                  #{proposal.id}: {proposal.proposal.title}
                </BrandText>
              </TouchableOpacity>
              <BrandText
                style={[fontSemibold13, { lineHeight: 13, color: neutral77 }]}
                numberOfLines={1}
              >
                Created by{" "}
                <OmniLink
                  to={{
                    screen: "UserPublicProfile",
                    params: { id: proposerId },
                  }}
                >
                  <Text style={{ color: "#16BBFF" }}>
                    {proposerAlias
                      ? `@${proposerAlias}`
                      : tinyAddress(proposal.proposal.proposer, 10)}
                  </Text>
                </OmniLink>
              </BrandText>
            </View>
          </View>
        </View>
        <View style={elemStyle}>
          <BrandText
            style={[fontSemibold14, { lineHeight: 14, color: neutral77 }]}
            numberOfLines={1}
          >
            Approved by{" "}
            <Text style={{ color: "white" }}>
              {trimFixed(approvedWeight.toFixed(4))}
            </Text>{" "}
            of{" "}
            <Text style={{ color: "white" }}>
              {trimFixed(totalWeight.toFixed(4))}
            </Text>{" "}
            ({trimFixed(requiredWeight.toFixed(4))} required)
          </BrandText>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: 13,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                height: progressBarHeight,
                flex: approvedWeight / requiredWeight,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                height: progressBarHeight,
                backgroundColor: neutral55,
                flex: (requiredWeight - approvedWeight) / requiredWeight,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 300,
            marginLeft: halfGap,
          }}
        >
          <ProposalActions daoId={daoId} proposal={proposal} />
        </View>
      </View>
      <DAOProposalModal
        visible={displayProposalModal}
        onClose={() => setDisplayProposalModal(false)}
        proposalInfo={proposal}
        daoId={daoId}
      />
    </View>
  );
};
