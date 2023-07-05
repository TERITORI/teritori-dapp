import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toBase64, toUtf8 } from "@cosmjs/encoding";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useMutation } from "@tanstack/react-query";

import { MultisigTransactionListType } from "./useFetchMultisigTransactionsById";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { mustGetCosmosNetwork } from "../../networks";
import { createSignature } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbSignature } from "../../utils/faunaDB/multisig/types";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

export const useApproveTransaction = () => {
  const { setToastError } = useFeedbacks();
  const { selectedWallet: walletAccount } = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  // req
  const mutation = useMutation(
    async ({
      tx,
      currentSignatures,
      addSignature,
      transactionID,
    }: {
      tx: Pick<
        MultisigTransactionListType,
        "sequence" | "fee" | "accountNumber" | "msgs" | "memo"
      >;
      currentSignatures: DbSignature[];
      addSignature: (sinature: DbSignature) => void;
      transactionID: string;
    }) => {
      try {
        const keplr = (window as KeplrWindow)?.keplr;
        if (!selectedNetworkId || !keplr || !walletAccount?.address) {
          return;
        }
        const network = mustGetCosmosNetwork(selectedNetworkId);

        const offlineSigner = keplr.getOfflineSignerOnlyAmino(network.chainId);

        const signerAddress = walletAccount.address;

        const signingClient = await SigningCosmWasmClient.offline(
          offlineSigner
        );
        // const signingClient = await SigningStargateClient.offline(
        //   offlineSigner
        // );
        const signerData = {
          accountNumber: tx.accountNumber,
          sequence: tx.sequence,
          chainId: network.chainId,
        };
        const tx_msgs = [];
        for (const msg of tx.msgs) {
          if (msg?.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract") {
            msg.value.msg = toUtf8(msg.value.msg);
            tx_msgs.push(msg);
          } else {
            tx_msgs.push(msg);
          }
        }
        const { bodyBytes, signatures } = await signingClient.sign(
          signerAddress,
          tx_msgs,
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
        console.error(err);
      }
    }
  );
  return mutation;
};
