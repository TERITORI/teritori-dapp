import React, { useMemo, useState } from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { DaoProposalModal } from "./DaoProposalModal";
import orgSVG from "../../../../assets/icons/multisig.svg";
import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { TertiaryButton } from "../../../components/buttons/TertiaryButton";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { DaoProposalSingleClient } from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  ProposalResponse,
  Vote,
} from "../../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { useDAOFirstProposalModule } from "../../../hooks/dao/useDAOProposalModules";
import { useDAOProposalVotes } from "../../../hooks/dao/useDAOProposalVotes";
import { useDAOProposalsConfig } from "../../../hooks/dao/useDAOProposalsConfig";
import { useDAOTotalVotingPower } from "../../../hooks/dao/useDAOTotalVotingPower";
import {
  useDAOVoteInfo,
  useInvalidateDAOVoteInfo,
} from "../../../hooks/dao/useDAOVoteInfo";
import {
  useDAOProposals,
  useInvalidateDAOProposals,
} from "../../../hooks/dao/useDaoProposals";
import { useIsDaoMember } from "../../../hooks/dao/useIsDaoMember";
import { useNSPrimaryAlias } from "../../../hooks/useNSPrimaryAlias";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  getUserId,
  parseUserId,
} from "../../../networks";
import { trimFixed } from "../../../utils/numbers";
import {
  errorColor,
  neutral33,
  neutral55,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { tinyAddress } from "../../../utils/text";

export const DaoProposalList: React.FC<{
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
      <DaoProposalModal
        visible={displayProposalModal}
        onClose={() => setDisplayProposalModal(false)}
        proposalInfo={proposal}
        daoId={daoId}
      />
    </View>
  );
};

export const ProposalActions: React.FC<{
  daoId: string | undefined;
  proposal: ProposalResponse;
}> = ({ daoId, proposal }) => {
  const wallet = useSelectedWallet();
  const selectedWallet = wallet;
  const proposalInfo = proposal;
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { data: isInDAO } = useIsDaoMember(daoId, selectedWallet?.userId);
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);
  const invalidateDAOVoteInfo = useInvalidateDAOVoteInfo(
    daoId,
    wallet?.userId,
    proposal.id
  );
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const { daoVoteInfo: ownVote } = useDAOVoteInfo(
    daoId,
    wallet?.userId,
    proposal.id
  );

  const vote = async (v: Vote) => {
    if (
      !selectedWallet ||
      proposalInfo.proposal.status !== "open" ||
      !daoFirstProposalModule?.address
    )
      return;
    try {
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const daoProposalClient = new DaoProposalSingleClient(
        signingClient,
        walletAddress,
        daoFirstProposalModule?.address
      );
      await daoProposalClient.vote(
        { proposalId: proposalInfo.id, vote: v },
        "auto"
      );
      await Promise.all([invalidateDAOVoteInfo(), invalidateDAOProposals()]);
      setToastSuccess({ title: "Voted", message: "" });
    } catch (err: any) {
      setToastError({
        title: "Failed to vote",
        message: err.message,
      });
    }
  };

  const execute = async () => {
    if (
      !selectedWallet ||
      proposalInfo.proposal.status !== "passed" ||
      !daoFirstProposalModule?.address
    )
      return;
    try {
      const walletAddress = selectedWallet.address;
      const networkId = selectedWallet.networkId;
      const signingClient = await getKeplrSigningCosmWasmClient(networkId);
      const daoProposalClient = new DaoProposalSingleClient(
        signingClient,
        walletAddress,
        daoFirstProposalModule?.address
      );
      const res = await daoProposalClient.execute({
        proposalId: proposalInfo.id,
      });
      if (
        res.events.find((ev) =>
          ev.attributes.find(
            (attr) =>
              attr.key === "proposal_execution_failed" &&
              attr.value === proposalInfo.id.toString()
          )
        )
      ) {
        console.error("failed to execute", res);
        throw new Error("internal error");
      }
      console.log("executed", res);
      await invalidateDAOProposals();
      setToastSuccess({ title: "Executed", message: "" });
    } catch (err) {
      console.error("failed to execute", err);
      await invalidateDAOProposals();
      setToastError({
        title: "Failed to execute",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
  };

  if (proposal.proposal.status === "open") {
    if (ownVote?.vote?.vote === "yes") {
      return <VoteStatus text="Voting: You approved" color={neutral77} />;
    }

    if (ownVote?.vote?.vote === "no") {
      return <VoteStatus text="Voting: You declined" color={neutral77} />;
    }

    if (ownVote?.vote?.vote === "abstain") {
      return <VoteStatus text="Voting: You abstained" color={neutral77} />;
    }
  }

  if (proposal.proposal.status === "executed") {
    return <VoteStatus text="Executed" color={primaryColor} />;
  }

  if (proposal.proposal.status === "execution_failed") {
    return <VoteStatus text="Execution failed" color={errorColor} />;
  }

  if (proposal.proposal.status === "rejected") {
    return <VoteStatus text="Rejected" color={errorColor} />;
  }

  if (proposal.proposal.status === "closed") {
    return <VoteStatus text="Closed" color={errorColor} />;
  }

  if (proposal.proposal.status === "passed") {
    if (!isInDAO) {
      return <VoteStatus text="Ready to execute" color={primaryColor} />;
    }
    return (
      <PrimaryButton
        text="Execute"
        size="M"
        fullWidth
        onPress={execute}
        loader
      />
    );
  }

  if (proposal.proposal.status === "open") {
    if (!isInDAO) {
      return <VoteStatus text="Voting" color={neutral77} />;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <SecondaryButton
          text="Approve"
          size="M"
          onPress={() => vote("yes")}
          loader
        />
        <PrimaryButtonOutline
          text="Decline"
          size="M"
          color={errorColor}
          onPress={() => vote("no")}
          // loader
        />
        <TertiaryButton
          text="Abstain"
          size="M"
          onPress={() => vote("abstain")}
          // loader
        />
      </View>
    );
  }

  return null;
};

const VoteStatus: React.FC<{
  text: string;
  color: string;
}> = ({ text, color }) => {
  return (
    <BrandText
      style={[
        fontSemibold14,
        {
          textTransform: "uppercase",
          textAlign: "center",
          borderLeftColor: color,
          borderLeftWidth: 1,
          borderRightColor: color,
          borderRightWidth: 1,
          lineHeight: 14,
          color,
          width: "100%",
          alignSelf: "center",
        },
      ]}
    >
      {text}
    </BrandText>
  );
};
