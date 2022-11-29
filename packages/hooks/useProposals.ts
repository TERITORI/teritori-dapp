import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgSubmitProposalEncodeObject } from "@cosmjs/stargate/build/modules/gov/messages";
import { useQuery } from "@tanstack/react-query";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";

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
  const selectedWallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();

  // ---- Getting proposasl from cosmos gov
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

    console.log("datadatadatadatadata", data);

    console.log("=========================== 00000");
    console.log("=========================== 00000", !selectedWallet?.address);

    // TODO: try catch + useMemo
    if (!selectedWallet?.address) return;

    console.log("=========================== 1111");
    console.log(
      "=========================== convertDenomToMicroDenom(initialDeposit)",
      convertDenomToMicroDenom(initialDeposit)
    );

    const signer = await getKeplrOfflineSigner();
    const client = await getTeritoriSigningStargateClient(signer);

    //TODO: Handle Claim deposit (if the proposal was accepted OR if the proposal never entered voting period)

    //TODO: Handle "Deposit to proposal". If min_deposit is reached, the proposal enters in PROPOSAL_STATUS_VOTING

    const value: TextProposal = {
      title,
      description,
    };

    // TODO: Add min_deposit, max_deposit_period, voting_period

    const msg: MsgSubmitProposalEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      value: {
        content: {
          typeUrl: type,
          value: TextProposal.encode(value).finish(),
        },
        initialDeposit: [
          { amount: convertDenomToMicroDenom(initialDeposit), denom: "utori" },
        ],
        proposer: selectedWallet?.address,
      },
    };

    console.log("=========================== 22222");

    const txResponse = await client.signAndBroadcast(
      selectedWallet?.address,
      [msg],
      "auto"
    );

    console.log("=========================== 333333");

    if (isDeliverTxFailure(txResponse)) {
      console.error("tx failed", txResponse);
      setToastError({
        title: "Transaction failed",
        message: txResponse.rawLog || "",
      });
      return;
    }
    setToastSuccess({ title: "Submit proposal success", message: "" });
  };

  return { proposals: networkProposals?.proposals || [], submitProposal };
};

// Returns the proposals from cosmos API
const getNetworkProposals = async (): Promise<CosmosProposalsResponse> => {
  const response = await fetch(
    `${teritoriRestProvider}/cosmos/gov/v1beta1/proposals`
  );
  return await response.json();
};
