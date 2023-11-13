import { toBase64 } from "@cosmjs/encoding";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import {
  ParsedTransaction,
  multisigTransactionsQueryKey,
} from "./useMultisigTransactions";
import { Signature } from "../../api/multisig/v1/multisig";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { getKeplrOnlyAminoStargateClient, getUserId } from "../../networks";
import useSelectedWallet from "../useSelectedWallet";

export const useApproveTransaction = () => {
  const { setToastError } = useFeedbacks();
  const walletAccount = useSelectedWallet();
  const multisigClient = useMultisigClient(walletAccount?.networkId);
  const authToken = useMultisigAuthToken(walletAccount?.userId);
  const queryClient = useQueryClient();

  return useCallback(
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
    }) => {
      try {
        const prevSigMatch = currentSignatures.findIndex(
          (signature) => signature.userAddress === walletAccount?.address,
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

        const { bodyBytes, signatures } = await client.sign(
          signerAddress,
          tx.msgs,
          tx.fee,
          tx.memo,
          signerData,
        );

        const bases64EncodedSignature = toBase64(signatures[0]);

        await multisigClient.SignTransaction({
          authToken,
          signature: bases64EncodedSignature,
          transactionId,
          bodyBytes,
        });

        await queryClient.invalidateQueries(
          multisigTransactionsQueryKey(
            selectedNetworkId,
            getUserId(selectedNetworkId, tx.multisigAddress),
          ),
        );
        await queryClient.invalidateQueries(
          multisigTransactionsQueryKey(selectedNetworkId, undefined),
        );
      } catch (err: any) {
        console.error(err);
        setToastError({
          title: "Transaction signature failed!",
          message: err.message,
        });
      }
    },
    [authToken, multisigClient, queryClient, setToastError, walletAccount],
  );
};
