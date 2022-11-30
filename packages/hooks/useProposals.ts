import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgSubmitProposalEncodeObject } from "@cosmjs/stargate/build/modules/gov/messages";
import { useQuery } from "@tanstack/react-query";
import { CommunityPoolSpendProposal } from "cosmjs-types/cosmos/distribution/v1beta1/distribution";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import {
  SoftwareUpgradeProposal,
  CancelSoftwareUpgradeProposal,
} from "cosmjs-types/cosmos/upgrade/v1beta1/upgrade";
import Long from "long";
import { useState } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { ProposalForm, ProposalType } from "../screens/Governance/types";
import { convertDenomToMicroDenom } from "../utils/conversion";
import { getKeplrOfflineSigner } from "../utils/keplr";
import {
  CosmosProposalsResponse,
  getTeritoriSigningStargateClient,
  teritoriRestProvider,
} from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useProposals = () => {
  console.log("YZF==================FKUJZBFOUZBOFZ");
  const selectedWallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();
  const [loading, setLoading] = useState(false);

  // ---- Getting proposals from cosmos gov
  const { data: networkProposals } = useQuery(
    ["proposals"],
    async () => getNetworkProposals(),
    { refetchInterval: 5000 }
  );

  const submitProposal = async (data: ProposalForm) => {
    const {
      title,
      description,
      type,
      minimumDeposit,
      initialDeposit,
      depositPeriodDays,
      depositPeriodHours,
      depositPeriodMinutes,
      votingPeriodDays,
      votingPeriodMinutes,
      votingPeriodHours,
    } = data;

    setLoading(true);

    // TODO: try catch + useMemo

    if (!selectedWallet?.address) return;
    const signer = await getKeplrOfflineSigner();
    const client = await getTeritoriSigningStargateClient(signer);

    //TODO: Handle Claim deposit (if the proposal was accepted OR if the proposal never entered voting period)
    //TODO: Handle "Deposit to proposal". If min_deposit is reached, the proposal enters in PROPOSAL_STATUS_VOTING

    const valueTextProposal: TextProposal = {
      title,
      description,
    };
    const valueParameterChangeProposal: ParameterChangeProposal = {
      title,
      description,
      // TODO: Handle these data
      changes: [
        {
          subspace: "staking",
          key: "MaxValidators",
          value: "150",
        },
      ],
    };
    const valueSoftwareUpgradeProposal: SoftwareUpgradeProposal = {
      title,
      description,
      // TODO: Handle these data
      plan: {
        name: "v1.1.1",
        height: new Long(0, 1570000),
        info: "",
      },
    };
    const valueCancelSoftwareUpgradeProposal: CancelSoftwareUpgradeProposal = {
      title,
      description,
    };
    const valueCommunityPoolProposal: CommunityPoolSpendProposal = {
      title,
      description,
      // TODO: Handle these data
      recipient: "wallet address",
      amount: [{ amount: "1000000", denom: "utori" }],
    };

    const valueByType = () => {
      switch (type) {
        case ProposalType.TEXT:
          return TextProposal.encode(valueTextProposal).finish();
        case ProposalType.PARAMETER_CHANGE:
          return ParameterChangeProposal.encode(
            valueParameterChangeProposal
          ).finish();
        case ProposalType.SOFTWARE_UPGRADE:
          return SoftwareUpgradeProposal.encode(
            valueSoftwareUpgradeProposal
          ).finish();
        case ProposalType.CANCEL_SOFTWARE_UPGRADE:
          return SoftwareUpgradeProposal.encode(
            valueCancelSoftwareUpgradeProposal
          ).finish();
        case ProposalType.COMMUNITY_POOL:
          return CommunityPoolSpendProposal.encode(
            valueCommunityPoolProposal
          ).finish();
      }
    };

    // TODO: Add min_deposit, max_deposit_period, voting_period

    const msg: MsgSubmitProposalEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      value: {
        content: {
          typeUrl: type,
          value: valueByType(),
        },
        initialDeposit: [
          { amount: convertDenomToMicroDenom(initialDeposit), denom: "utori" },
        ],
        proposer: selectedWallet?.address,
      },
    };

    const txResponse = await client.signAndBroadcast(
      selectedWallet?.address,
      [msg],
      "auto"
    );

    setLoading(false);

    if (isDeliverTxFailure(txResponse)) {
      console.error("tx failed", txResponse);
      setToastError({
        title: "Transaction failed",
        message: txResponse.rawLog || "",
      });
      return;
    }
    setToastSuccess({ title: "Proposal successfully created", message: "" });
  };
  return {
    proposals: networkProposals?.proposals || [],
    submitProposal,
    loading,
  };
};

// Returns the proposals from cosmos API
const getNetworkProposals = async (): Promise<CosmosProposalsResponse> => {
  const response = await fetch(
    `${teritoriRestProvider}/cosmos/gov/v1beta1/proposals`
  );
  return await response.json();
};
