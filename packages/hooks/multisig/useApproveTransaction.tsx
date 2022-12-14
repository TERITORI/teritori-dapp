import { SigningStargateClient } from "@cosmjs/stargate";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useMutation } from "@tanstack/react-query";
import { toBase64 } from "cosmwasm";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMultisigContext } from "../../context/MultisigReducer";
import { createSignature } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbSignature, DbTransaction } from "../../utils/founaDB/multisig/types";
import useSelectedWallet from "../useSelectedWallet";

export const useApproveTransaction = () => {
  // variables
  const { state } = useMultisigContext();
  const { setToastError } = useFeedbacks();
  const walletAccount = useSelectedWallet();

  // req
  const mutation = useMutation(
    async ({
      tx,
      currentSignatures,
      addSignature,
      transactionID,
    }: {
      tx: DbTransaction;
      currentSignatures: DbSignature[];
      addSignature: (sinature: DbSignature) => void;
      transactionID: string;
    }) => {
      try {
        const keplr = (window as KeplrWindow)?.keplr;
        if (!state?.chain.chainId || !keplr || !walletAccount?.address) {
          return;
        }

        const offlineSigner = keplr.getOfflineSignerOnlyAmino(
          state.chain.chainId
        );

        const signerAddress = walletAccount.address;

        const signingClient = await SigningStargateClient.offline(
          offlineSigner
        );

        const signerData = {
          accountNumber: tx.accountNumber,
          sequence: tx.sequence,
          chainId: state.chain.chainId,
        };

        const { bodyBytes, signatures } = await signingClient.sign(
          signerAddress,
          tx.msgs,
          tx.fee,
          tx.memo,
          signerData
        );

        // check existing signatures
        const bases64EncodedSignature = toBase64(signatures[0]);
        const bases64EncodedBodyBytes = toBase64(bodyBytes);
        const prevSigMatch = currentSignatures.findIndex(
          (signature) => signature.signature === bases64EncodedSignature
        );

        if (prevSigMatch > -1) {
          setToastError({
            title: "Transaction signature failed!",
            message: "This account has already signed.",
          });
        } else {
          const signature = {
            bodyBytes: bases64EncodedBodyBytes,
            signature: bases64EncodedSignature,
            address: signerAddress,
          };
          await createSignature(signature, transactionID);
          addSignature(signature);
        }
      } catch (err: any) {
        console.log(err);
      }
    }
  );
  return mutation;
};
