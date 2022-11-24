import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgSubmitProposalEncodeObject } from "@cosmjs/stargate/build/modules/gov/messages";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { getKeplrOfflineSigner } from "../utils/keplr";
import { getTeritoriSigningStargateClient } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";

export const useProposals = () => {
  const selectedWAllet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();

  const submitProposal = async (callback?: () => void) => {
    // TODO: try catch + useMemo
    if (!selectedWAllet?.address) return;

    const signer = await getKeplrOfflineSigner();
    const client = await getTeritoriSigningStargateClient(signer);

    const proposal = {
      messages: [
        {
          typeUrl: "/cosmos.gov.v1beta1.TextProposal",
          value: {
            title: "Test Proposal",
            description: "This is a test proposal",
          },
        },
      ],
      initial_deposit: [{ denom: "utori", amount: "100000" }],
      proposer: selectedWAllet?.address,
      metadata: 4,
    };

    const msg: MsgSubmitProposalEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      value: proposal,
    };

    const txResponse = await client.signAndBroadcast(
      selectedWAllet?.address,
      [msg],
      "auto"
    );

    if (isDeliverTxFailure(txResponse)) {
      callback && callback();
      console.error("tx failed", txResponse);
      setToastError({
        title: "Transaction failed",
        message: txResponse.rawLog || "",
      });
      return;
    }
    setToastSuccess({ title: "Submit proposal success", message: "" });
  };

  return { submitProposal };
};
