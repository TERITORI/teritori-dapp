import { isDeliverTxFailure } from "@cosmjs/stargate";
import { MsgSubmitProposalEncodeObject } from "@cosmjs/stargate/build/modules/gov/messages";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { getKeplrOfflineSigner } from "../utils/keplr";
import { getTeritoriSigningStargateClient } from "../utils/teritori";
import useSelectedWallet from "./useSelectedWallet";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";


export const useProposals = () => {
  const selectedWallet = useSelectedWallet();
  const { setToastSuccess, setToastError } = useFeedbacks();

  const submitProposal = async (callback?: () => void) => {
    // TODO: try catch + useMemo
    if (!selectedWallet?.address) return;

    const signer = await getKeplrOfflineSigner();
    const client = await getTeritoriSigningStargateClient(signer);

    // const proposal = {
    //   content: {
    //     typeUrl: "/cosmos.params.v1beta1.TextProposal",
    //     value: new Uint8Array(255),
    //     description: "description blabla test",
    //     title: "title blabla test"
    //   },
    //   initialDeposit: [{amount: "0", denom: "uatom"}],
    //   proposer: selectedWAllet?.address
    // }

    // const proposal = {
    //   messages: [
    //     {
    //       typeUrl: "/cosmos.gov.v1beta1.TextProposal",
    //       value: {
    //         title: "Test Proposal",
    //         description: "This is a test proposal",
    //       },
    //     },
    //   ],
    //   initial_deposit: [{ denom: "utori", amount: "100000" }],
    //   proposer: selectedWAllet?.address,
    //   metadata: 4,
    // };

    const value: TextProposal = {
      title: "Test Proposal",
      description: "This is a test proposal",
    };

    const msg: MsgSubmitProposalEncodeObject = {
      typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
      value: {
        content: {
          typeUrl: "/cosmos.gov.v1beta1.TextProposal",
          value: TextProposal.encode(value).finish()
        },
        initialDeposit: [{amount: "1000", denom: "utori"}],
        proposer: selectedWallet?.address,
      }
    };

    const txResponse = await client.signAndBroadcast(
      selectedWallet?.address,
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
