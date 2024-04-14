import { StdSignDoc } from "@cosmjs/amino";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import {
  multisigTransactionsQueryKey,
  ParsedTransaction,
} from "./useMultisigTransactions";
import useSelectedWallet from "../useSelectedWallet";

import { Signature } from "@/api/multisig/v1/multisig";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { getUserId } from "@/networks";
import { cosmosAminoTypes, cosmosTypesRegistry } from "@/networks/cosmos-types";
import { getKeplrOnlyAminoSigner } from "@/networks/signer";

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

        const signer = await getKeplrOnlyAminoSigner(selectedNetworkId);
        const signerAddress = walletAccount.address;

        const sd: StdSignDoc = {
          chain_id: tx.chainId,
          account_number: tx.accountNumber.toString(),
          sequence: tx.sequence.toString(),
          fee: tx.fee,
          msgs: tx.msgs.map((m) => {
            return cosmosAminoTypes.toAmino(m);
          }),
          memo: "",
        };

        console.log("will sign", sd);

        const {
          signature: { signature },
        } = await signer.signAmino(signerAddress, sd);

        await multisigClient.SignTransaction({
          authToken,
          signature,
          transactionId,
          bodyBytes: cosmosTypesRegistry.encodeTxBody({
            messages: tx.msgs,
          }),
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
