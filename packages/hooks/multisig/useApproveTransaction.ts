import { StdSignDoc } from "@cosmjs/amino";
import { MsgSend } from "@gnolang/gno-js-client";
import { PubKeySecp256k1, Tx } from "@gnolang/tm2-js-client";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash";
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
        | "chainType"
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
      switch (tx.chainType) {
        case "cosmos": {
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

            const signer = await getKeplrOnlyAminoSigner(selectedNetworkId, {
              disableBalanceCheck: true,
              preferNoSetFee: true,
              preferNoSetMemo: true,
            });
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

            const {
              signed,
              signature: { signature },
            } = await signer.signAmino(signerAddress, sd);

            if (!isEqual(sd, signed)) {
              throw new Error(
                "Tx modified by signer, you can't change the fee or memo in a multisig transaction!",
              );
            }

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
          break;
        }
        case "gno": {
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

            const adena = window.adena as any;
            if (!selectedNetworkId || !adena || !walletAccount?.address) {
              setToastError({
                title: "Transaction signature failed!",
                message: "Invalid context.",
              });
              return;
            }

            console.log("tx", tx);

            const doc = {
              messages: tx.msgs.map((msg) => ({
                type: msg.typeUrl,
                value: msg.value,
              })),
              gasFee: parseInt(tx.fee.amount[0].amount, 10),
              gasWanted: parseInt(tx.fee.gas, 10),
              memo: tx.memo || undefined,
              multisig: true,
              accountNumber: tx.accountNumber,
              sequence: tx.sequence,
            };

            const canonTx = Tx.create({
              messages: tx.msgs.map((msg) => ({
                type_url: msg.typeUrl,
                value: MsgSend.encode(msg.value).finish(), // XXX: support other messages
              })),
              fee: {
                gas_fee: tx.fee.amount[0].amount + tx.fee.amount[0].denom,
                gas_wanted: tx.fee.gas,
              },
              memo: tx.memo,
            });

            console.log("doc", doc);

            const res = await adena.SignTx(doc);

            console.log("res", res);

            if (res.status === "failure") {
              throw new Error(res.message);
            }

            const signedTxBz = new Uint8Array(
              Buffer.from(res.data.encodedTransaction, "base64"),
            );
            const signedTx = Tx.decode(signedTxBz);

            console.log("signedTx", signedTx);

            const pkRaw = Buffer.from(
              signedTx.signatures[0].pub_key?.value || "",
            );
            console.log("pkraw", pkRaw.toString("base64"));

            const pk = PubKeySecp256k1.decode(new Uint8Array(pkRaw));
            console.log("pk", Buffer.from(pk.key).toString("base64"));

            const sigB64 = Buffer.from(
              signedTx.signatures[0].signature || "",
            ).toString("base64");
            console.log("sig", sigB64);

            signedTx.signatures = [];

            if (!isEqual(canonTx, signedTx)) {
              throw new Error(
                "Tx modified by signer, you can't change the fee or memo in a multisig transaction!",
              );
            }

            // WARNING: only send supported for now

            await multisigClient.SignTransaction({
              authToken,
              signature: sigB64,
              transactionId,
              bodyBytes: Tx.encode(signedTx).finish(),
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
          break;
        }
      }
    },
    [authToken, multisigClient, queryClient, setToastError, walletAccount],
  );
};
