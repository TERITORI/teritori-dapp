import { MultisigThresholdPubkey } from "@cosmjs/amino";
import { fromBase64 } from "@cosmjs/encoding";
import { makeMultisignedTx, StargateClient } from "@cosmjs/stargate";
import { useMutation } from "@tanstack/react-query";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import { MultisigTransactionListType } from "./useFetchMultisigTransactionsById";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigContext } from "../../context/MultisigReducer";
import { completeTransaction } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbSignature } from "../../utils/faunaDB/multisig/types";

export const useBroadcastTransaction = () => {
  const { state } = useMultisigContext();
  const { setToastError, setToastSuccess } = useFeedbacks();

  // req
  return useMutation(
    async ({
      tx,
      currentSignatures,
      transactionID,
      pubkey,
    }: {
      tx: Pick<MultisigTransactionListType, "sequence" | "fee">;
      currentSignatures: DbSignature[];
      transactionID: string;
      pubkey?: MultisigThresholdPubkey;
    }) => {
      try {
        if (!state.chain?.nodeAddress || !pubkey || !state.chain?.nodeAddress) {
          return;
        }

        const bodyBytes = fromBase64(currentSignatures[0].bodyBytes);
        const signedTx = makeMultisignedTx(
          pubkey,
          tx.sequence,
          tx.fee,
          bodyBytes,
          new Map(
            currentSignatures.map((s) => [s.address, fromBase64(s.signature)])
          )
        );
        const broadcaster = await StargateClient.connect(
          state.chain.nodeAddress
        );
        const result = await broadcaster.broadcastTx(
          Uint8Array.from(TxRaw.encode(signedTx).finish())
        );

        if (result.code !== 0) {
          console.error("err", result.rawLog);
          setToastError({
            title: "The tx is emitted, but something went wrong!",
            message: result.rawLog || "",
          });
        }

        await completeTransaction(
          transactionID,
          result.transactionHash,
          tx.sequence + 1
        );

        setToastSuccess({
          title: "Broadcast successfully!",
          message:
            "We have also removed signatures from all the obsolete transactions so you might need sign those again.",
          duration: 10000,
        });

        return result.transactionHash;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error("err", e);

        if (e instanceof Error) {
          setToastError({ title: "Something went wrong!", message: e.message });
        }
      }
    }
  );
};
