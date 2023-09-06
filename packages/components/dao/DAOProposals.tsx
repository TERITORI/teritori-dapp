import React, { useState } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";

import { DAOProposalModal } from "./DAOProposalModal";
import { ProposalActions } from "./ProposalActions";
import multisigWhiteSVG from "../../../assets/icons/multisig_white.svg";
import {
  AppProposalResponse,
  useDAOProposals,
} from "../../hooks/dao/useDAOProposals";
import { useDAOTotalVotingPower } from "../../hooks/dao/useDAOTotalVotingPower";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { getUserId, parseUserId } from "../../networks";
import {
  neutral33,
  neutral55,
  neutral77,
  successColor,
  errorColor,
  neutral17,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";

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

// TODO: double check we properly use threshold and quorum
// TODO: use correct threshold, quorum and total power for passed/executed proposals

const ProposalRow: React.FC<{
  daoId: string | undefined;
  proposal: AppProposalResponse;
}> = ({ daoId, proposal }) => {
  const [network] = parseUserId(daoId);
  const { daoTotalVotingPower } = useDAOTotalVotingPower(daoId);

  const halfGap = 24;
  const elemStyle: ViewStyle = {
    justifyContent: "space-between",
    paddingHorizontal: halfGap,
    flex: 1,
  };

  const weights = {
    approved: parseFloat(proposal.proposal.votes.yes),
    declined: parseFloat(proposal.proposal.votes.no),
    abstained: parseFloat(proposal.proposal.votes.abstain),
    voted: 0,
  };
  weights.voted = weights.approved + weights.declined + weights.abstained;

  const totalWeight = parseFloat(daoTotalVotingPower?.power || "0");

  let thresholdGain = 0;
  let quorumGain = 0;
  if (
    proposal?.proposal.threshold &&
    "threshold_quorum" in proposal.proposal.threshold
  ) {
    const threshold = proposal.proposal.threshold.threshold_quorum.threshold;
    if ("percent" in threshold) {
      thresholdGain = parseFloat(threshold.percent);
    }
    const quorum = proposal.proposal.threshold.threshold_quorum.quorum;
    if ("percent" in quorum) {
      quorumGain = parseFloat(quorum.percent);
    }
  }

  const quorumWeight =
    proposal.proposal.status === "open"
      ? quorumGain * totalWeight
      : quorumGain * weights.voted;
  const targetWeight = Math.max(weights.voted, quorumWeight);
  const thresholdWeight = thresholdGain * targetWeight;

  const [displayProposalModal, setDisplayProposalModal] =
    useState<boolean>(false);

  const progressBarHeight = 6;

  const proposerId = getUserId(network?.id, proposal.proposal.proposer);

  const { primaryAlias: proposerAlias } = useNSPrimaryAlias(proposerId);
  const [isHovered, setHovered] = useState(false);

  return (
    <>
      <CustomPressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        onPress={() => setDisplayProposalModal(true)}
        style={[
          {
            flexDirection: "row",
            height: 64,
            alignItems: "center",
            borderBottomColor: neutral33,
            borderBottomWidth: 1,
          },
          isHovered && { backgroundColor: neutral17 },
        ]}
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
                source={multisigWhiteSVG}
                width={32}
                height={32}
                style={{
                  marginRight: layout.spacing_x2,
                  marginLeft: layout.spacing_x2,
                }}
              />
              <View
                style={{
                  height: "100%",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <BrandText
                  style={[
                    fontSemibold14,
                    { marginBottom: layout.spacing_x0_75 },
                  ]}
                  numberOfLines={1}
                >
                  #{proposal.id}: {proposal.proposal.title}
                </BrandText>
                <BrandText
                  style={[fontSemibold13, { color: neutral77 }]}
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
            {proposal.proposal.status === "open" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: 13,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText
                    style={[fontSemibold14, { color: neutral77 }]}
                    numberOfLines={1}
                  >
                    Voted:{" "}
                    <Text style={{ color: "white" }}>
                      {Math.ceil(weights.voted)}
                    </Text>
                    /
                    <Text style={{ color: "white" }}>
                      {Math.ceil(thresholdWeight)}
                    </Text>
                  </BrandText>
                  <BrandText
                    style={[fontSemibold14, { color: neutral77 }]}
                    numberOfLines={1}
                  >
                    Yes:{" "}
                    <Text style={{ color: "white" }}>
                      {Math.ceil(weights.approved)}
                    </Text>
                    /
                    <Text style={{ color: "white" }}>
                      {Math.ceil(quorumWeight)}
                    </Text>
                  </BrandText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    height: 13,
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: successColor,
                        height: progressBarHeight,
                        flex: weights.approved / targetWeight,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "white",
                        height: progressBarHeight,
                        flex: weights.abstained / targetWeight,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: errorColor,
                        height: progressBarHeight,
                        flex: weights.declined / targetWeight,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: neutral55,
                        height: progressBarHeight,
                        flex: (targetWeight - weights.voted) / targetWeight,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "black",
                      height: progressBarHeight,
                      position: "absolute",
                      left: `${quorumGain * 100}%`,
                      width: 1,
                    }}
                  />
                </View>
              </>
            )}
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
      </CustomPressable>

      <DAOProposalModal
        visible={displayProposalModal}
        onClose={() => setDisplayProposalModal(false)}
        proposalInfo={proposal}
        daoId={daoId}
      />
    </>
  );
};
