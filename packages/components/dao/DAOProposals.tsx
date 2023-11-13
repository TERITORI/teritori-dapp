import React, { useState } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DAOProposalModal } from "./DAOProposalModal";
import { ProposalActions } from "./ProposalActions";
import {
  AppProposalResponse,
  useDAOProposals,
} from "../../hooks/dao/useDAOProposals";
import { getUserId, parseUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import {
  neutral33,
  neutral55,
  neutral77,
  successColor,
  errorColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../utils/style/fonts";
import { getTxInfo } from "../../utils/transactions/getTxInfo";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { Username } from "../user/Username";

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

  const halfGap = 24;
  const elemStyle: ViewStyle = {
    height: 32,
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

  const totalWeight = parseFloat(proposal.proposal.total_power);
  const totalMeaningfulWeight = totalWeight - weights.abstained;

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

  const quorumWeight = quorumGain * totalMeaningfulWeight;

  const thresholdWeight = thresholdGain * Math.max(weights.voted, quorumWeight);

  const [displayProposalModal, setDisplayProposalModal] =
    useState<boolean>(false);

  const progressBarHeight = 6;

  const proposerId = getUserId(network?.id, proposal.proposal.proposer);

  const navigation = useAppNavigation();

  const { name, icon } = getTxInfo(
    proposal.proposal.msgs,
    navigation,
    network,
    { textStyle: [fontSemibold13, { lineHeight: 13 }] },
  );

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
              source={icon}
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
                  #{proposal.id}: {proposal.proposal.title || name}
                </BrandText>
              </TouchableOpacity>
              <View>
                <BrandText
                  style={[fontSemibold13, { lineHeight: 13, color: neutral77 }]}
                  numberOfLines={1}
                >
                  Created by{" "}
                  <Username
                    userId={proposerId}
                    textStyle={[fontSemibold13, { lineHeight: 13 }]}
                  />
                </BrandText>
              </View>
            </View>
          </View>
        </View>
        <View style={elemStyle}>
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
              style={[fontSemibold14, { lineHeight: 14, color: neutral77 }]}
              numberOfLines={1}
            >
              Voted:{" "}
              <Text style={{ color: "white" }}>{Math.ceil(weights.voted)}</Text>
              /<Text style={{ color: "white" }}>{Math.ceil(quorumWeight)}</Text>
            </BrandText>
            <BrandText
              style={[fontSemibold14, { lineHeight: 14, color: neutral77 }]}
              numberOfLines={1}
            >
              Yes:{" "}
              <Text style={{ color: "white" }}>
                {Math.ceil(weights.approved)}
              </Text>
              /
              <Text style={{ color: "white" }}>
                {Math.ceil(thresholdWeight)}
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
                  flex: weights.approved / totalWeight,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  height: progressBarHeight,
                  flex: weights.abstained / totalWeight,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: errorColor,
                  height: progressBarHeight,
                  flex: weights.declined / totalWeight,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: neutral55,
                  height: progressBarHeight,
                  flex: (totalWeight - weights.voted) / totalWeight,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "black",
                height: progressBarHeight,
                position: "absolute",
                left: `${(thresholdWeight / totalWeight) * 100}%`,
                width: 1,
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
