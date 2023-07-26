import { toBase64 } from "@cosmjs/encoding";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { useMultisigClient } from "./useMultisigClient";
import {
  ParsedTransaction,
  multisigTransactionsQueryKey,
} from "./useMultisigTransactions";
import { Signature } from "../../api/multisig/v1/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { getKeplrOnlyAminoStargateClient } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";
import useSelectedWallet from "../useSelectedWallet";

export const useApproveTransaction = () => {
  const { setToastError } = useFeedbacks();
  const { selectedWallet: walletAccount } = useSelectedWallet();
  const multisigClient = useMultisigClient();
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, walletAccount?.address)
  );
  const queryClient = useQueryClient();
  // req
  return useMutation(
    async ({
      tx,
      currentSignatures,
      transactionId,
    }: {
      tx: Pick<
        ParsedTransaction,
        | "chainId"
        | "multisigAddress"
        | "accountNumber"
        | "fee"
        | "msgs"
        | "sequence"
        | "memo"
      >;
      currentSignatures: Signature[];
      transactionId: number;
    }): Promise<void> => {
      try {
        const prevSigMatch = currentSignatures.findIndex(
          (signature) => signature.userAddress === walletAccount?.address
        );
        if (prevSigMatch > -1) {
          setToastError({
            title: "Transaction signature failed!",
            message: "This account has already signed.",
          });
          return;
        }

        const selectedNetworkId = walletAccount?.networkId;

        const keplr = (window as KeplrWindow)?.keplr;
        if (!selectedNetworkId || !keplr || !walletAccount?.address) {
          return;
        }

        const client = await getKeplrOnlyAminoStargateClient(selectedNetworkId);

        const signerAddress = walletAccount.address;
        const signerData = {
          accountNumber: tx.accountNumber,
          sequence: tx.sequence,
          chainId: tx.chainId,
        };

        // FIXME: remove this hack
        const parsedMessages = tx.msgs.map((msg) => {
          if (msg.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
            const modified = {
              ...msg,
              value: {
                ...msg.value,
                msg: Uint8Array.from(Object.values(msg.value.msg)),
              },
            };
            console.log("modified", modified);
            return modified;
          }
          return msg;
        });

        const { bodyBytes, signatures } = await client.sign(
          signerAddress,
          parsedMessages,
          tx.fee,
          tx.memo,
          signerData
        );

        const bases64EncodedSignature = toBase64(signatures[0]);

        await multisigClient.SignTransaction({
          authToken,
          signature: bases64EncodedSignature,
          transactionId,
          bodyBytes,
        });

        // FIXME: should I do that? addSignature(signature);

        queryClient.invalidateQueries(
          multisigTransactionsQueryKey(tx.chainId, tx.multisigAddress)
        );
        queryClient.invalidateQueries(
          multisigTransactionsQueryKey(tx.chainId, undefined)
        );
      } catch (err: any) {
        console.error(err);
      }
    }
  );
};
