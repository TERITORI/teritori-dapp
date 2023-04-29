import { MsgVoteEncodeObject, isDeliverTxFailure } from "@cosmjs/stargate";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import Long from "long";
import { useCallback } from "react";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWallet } from "../wallets/useWallet";
import { useWalletStargateClient } from "../wallets/useWalletClients";

export const useCosmosVote = (walletId: string | undefined) => {
  const wallet = useWallet(walletId);
  const client = useWalletStargateClient(walletId);
  const { setToastError } = useFeedbacks();

  return useCallback(
    async (
      proposalId: Long | undefined,
      voteOption: VoteOption | undefined
    ) => {
      if (!wallet || !client) {
        setToastError({
          title: "Wallet Error",
          message: "You need to register your teritori wallet",
        });
        return;
      }

      try {
        const vote: MsgVoteEncodeObject = {
          typeUrl: "/cosmos.gov.v1beta1.MsgVote",
          value: {
            proposalId,
            voter: wallet.address,
            option: voteOption,
          },
        };
        const result = await client.signAndBroadcast(
          wallet.address,
          [vote],
          "auto"
        );
        if (isDeliverTxFailure(result)) {
          setToastError({
            title: "Vote failed",
            message: "Transaction failed",
          });
        }
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setToastError({
            title: "Vote failed",
            message: err.message,
          });
        }
      }
    },
    [client, setToastError, wallet]
  );
};
