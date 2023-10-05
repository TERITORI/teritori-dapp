import { MultisigThresholdPubkey } from "@cosmjs/amino";
import { makeMultisignedTxBytes } from "@cosmjs/stargate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { useMultisigClient } from "./useMultisigClient";
import {
  ParsedTransaction,
  multisigTransactionsQueryKey,
} from "./useMultisigTransactions";
import { Signature } from "../../api/multisig/v1/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  getCosmosNetworkByChainId,
  getNonSigningStargateClient,
} from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";
import useSelectedWallet from "../useSelectedWallet";

export const useBroadcastTransaction = () => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, selectedWallet?.address)
  );
  const multisigClient = useMultisigClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      tx,
      currentSignatures,
      transactionId,
      pubkey,
    }: {
      tx: Pick<
        ParsedTransaction,
        "fee" | "sequence" | "chainId" | "multisigAddress"
      >;
      currentSignatures: Signature[];
      transactionId: number;
      pubkey?: MultisigThresholdPubkey;
    }) => {
      try {
        if (!pubkey) {
          throw new Error("Pubkey not found");
        }

        const signedTx = makeMultisignedTxBytes(
          pubkey,
          tx.sequence,
          tx.fee,
          currentSignatures[0].bodyBytes,
          new Map(
            currentSignatures.map((s) => [
              s.userAddress,
              Buffer.from(s.value, "base64"),
            ])
          )
        );

        const network = getCosmosNetworkByChainId(tx.chainId);
        if (!network) {
          throw new Error("Network not found");
        }
        const broadcaster = await getNonSigningStargateClient(network?.id);
        const result = await broadcaster.broadcastTx(signedTx);

        if (result.code !== 0) {
          console.error("err", result.rawLog);
          setToastError({
            title: "The tx is emitted, but something went wrong!",
            message: result.rawLog || "",
          });
        }

        await multisigClient.CompleteTransaction({
          authToken,
          transactionId,
          finalHash: result.transactionHash,
        });

        setToastSuccess({
          title: "Broadcast successfully!",
          message:
            "We have also removed signatures from all the obsolete transactions so you might need sign those again.",
          duration: 10000,
        });

        queryClient.invalidateQueries(
          multisigTransactionsQueryKey(tx.chainId, tx.multisigAddress)
        );
        queryClient.invalidateQueries(
          multisigTransactionsQueryKey(tx.chainId, undefined)
        );

        return result.transactionHash;
      } catch (e: unknown) {
        console.error("err", e);
        if (e instanceof Error) {
          setToastError({ title: "Something went wrong!", message: e.message });
        }
      }
    }
  );
};
