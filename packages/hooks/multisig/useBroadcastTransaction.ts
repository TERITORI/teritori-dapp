import { MultisigThresholdPubkey } from "@cosmjs/amino";
import { makeMultisignedTxBytes } from "@cosmjs/stargate";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import {
  Any,
  PubKeySecp256k1,
  TransactionEndpoint,
  Tx,
  TxSignature,
} from "@gnolang/tm2-js-client";
import {
  createCompactBitArray,
  PubKeyMultisig,
  compactBitArraySetIndex,
  Multisignature,
} from "@gnolang/tm2-js-client/bin/proto/tm2/multisig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Buffer } from "buffer";
import Long from "long";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import {
  ParsedTransaction,
  multisigTransactionsQueryKey,
} from "./useMultisigTransactions";
import { multisigTransactionsCountsQueryKey } from "./useMultisigTransactionsCounts";
import useSelectedWallet from "../useSelectedWallet";

import { Signature } from "@/api/multisig/v1/multisig";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  getNetworkByChainId,
  getNonSigningStargateClient,
  getUserId,
  NetworkKind,
} from "@/networks";
import { addrFromPubkey } from "@/utils/gno";

export const useBroadcastTransaction = () => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);
  const multisigClient = useMultisigClient(selectedWallet?.networkId);
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
        | "fee"
        | "sequence"
        | "chainId"
        | "multisigAddress"
        | "chainType"
        | "multisigPubkeyJson"
      >;
      currentSignatures: Signature[];
      transactionId: number;
      pubkey?: MultisigThresholdPubkey;
    }) => {
      try {
        let finalHash;
        const network = getNetworkByChainId(tx.chainType, tx.chainId);
        if (!network) {
          throw new Error("Network not found");
        }
        switch (network.kind) {
          case NetworkKind.Cosmos: {
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
                  new Uint8Array(Buffer.from(s.value, "base64")),
                ]),
              ),
            );

            const broadcaster = await getNonSigningStargateClient(network?.id);
            const result = await broadcaster.broadcastTx(signedTx);

            if (result.code !== 0) {
              console.error("err", result.rawLog);
              setToastError({
                title: "The tx is emitted, but something went wrong!",
                message: result.rawLog || "",
              });
            }
            finalHash = result.transactionHash;
            break;
          }
          case NetworkKind.Gno: {
            // eslint-disable-next-line no-restricted-syntax
            const mspk = JSON.parse(tx.multisigPubkeyJson);

            const aminoMspk = PubKeyMultisig.create({
              k: 0,
              pub_keys: [],
            });

            const k = mspk.threshold as string;
            aminoMspk.k = Long.fromString(k);

            const sigs: Uint8Array[] = [];
            const bArr = createCompactBitArray(mspk.pubkeys.length);
            for (let i = 0; i < mspk.pubkeys.length; i++) {
              const pk = mspk.pubkeys[i];

              if (pk["@type"] !== "/tm.PubKeySecp256k1") {
                throw new Error(`unpexpected pk type ${pk["@type"]}`);
              }

              const pkval = pk.value as string;
              aminoMspk.pub_keys.push(
                Any.create({
                  type_url: pk["@type"],
                  value: PubKeySecp256k1.encode({
                    key: new Uint8Array(Buffer.from(pkval, "base64")),
                  }).finish(),
                }),
              );

              const addr = addrFromPubkey(
                new Uint8Array(Buffer.from(pk.value, "base64")),
              );

              let sig;
              for (const csig of currentSignatures) {
                if (csig.userAddress === addr) {
                  sig = csig;
                }
              }

              if (sig === undefined) {
                continue;
              }

              compactBitArraySetIndex(bArr, i, true);
              sigs.push(new Uint8Array(Buffer.from(sig.value, "base64")));
            }

            const ms = Multisignature.create({
              bit_array: bArr,
              sigs,
            });

            const msigBz = Multisignature.encode(ms).finish();
            const msSig: TxSignature = {
              pub_key: {
                type_url: mspk["@type"],
                value: PubKeyMultisig.encode(aminoMspk).finish(),
              },
              signature: msigBz,
            };

            const client = new GnoJSONRPCProvider(network.endpoint);
            const txBody = Tx.decode(currentSignatures[0].bodyBytes);

            txBody.signatures = [msSig];
            const txBz = Tx.encode(txBody).finish();
            const txB64 = Buffer.from(txBz).toString("base64");

            const res = await client.sendTransaction(
              txB64,
              TransactionEndpoint.BROADCAST_TX_COMMIT,
            );

            finalHash = res.hash;
            break;
          }
          default: {
            throw new Error(`unknown chain type ${tx.chainType}`);
          }
        }

        await multisigClient.CompleteTransaction({
          authToken,
          transactionId,
          finalHash,
        });

        setToastSuccess({
          title: "Broadcast successfully!",
          message:
            "We have also removed signatures from all the obsolete transactions so you might need sign those again.",
          duration: 10000,
        });

        await queryClient.invalidateQueries(
          multisigTransactionsQueryKey(
            network.id,
            getUserId(network.id, tx.multisigAddress),
          ),
        );
        await queryClient.invalidateQueries(
          multisigTransactionsQueryKey(network.id, undefined),
        );
        await queryClient.invalidateQueries(
          multisigTransactionsCountsQueryKey(network.id),
        );

        return finalHash;
      } catch (e: unknown) {
        console.error("err", e);
        if (e instanceof Error) {
          setToastError({ title: "Something went wrong!", message: e.message });
        }
      }
    },
  );
};
