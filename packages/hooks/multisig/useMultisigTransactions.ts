import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { decodeTxMessages } from "@gnolang/gno-js-client";
import { TxFee } from "@gnolang/tm2-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";

import { ExecutionState, Transaction } from "@/api/multisig/v1/multisig";
import { NetworkKind, parseUserId } from "@/networks";
import { cosmosTypesRegistry } from "@/networks/cosmos-types";

const batchSize = 16;

export type ParsedTransaction = Omit<
  Transaction,
  "createdAt" | "msgs" | "fee"
> & {
  createdAt: Date;
  msgs: EncodeObject[];
  fee: StdFee;
};

export const multisigTransactionsQueryKey = (
  networkId: string | undefined,
  multisigUserId: string | undefined,
) => ["multisig-transactions", networkId, multisigUserId];

export const useMultisigTransactions = (
  userId: string | undefined,
  multisigUserId: string | undefined,
  types: string[],
  executionState: ExecutionState,
) => {
  const authToken = useMultisigAuthToken(userId);
  const [network] = parseUserId(userId);
  const client = useMultisigClient(network?.id);

  return useInfiniteQuery(
    [
      ...multisigTransactionsQueryKey(network?.id, multisigUserId),
      types,
      executionState,
      authToken,
    ],
    async ({ pageParam }) => {
      if (
        network?.kind !== NetworkKind.Gno &&
        network?.kind !== NetworkKind.Cosmos
      ) {
        return { data: [], next: null };
      }

      const chainId = network?.chainId;

      const [, multisigAddress] = parseUserId(multisigUserId);

      const req = {
        chainType: network?.kind.toLowerCase(),
        authToken,
        chainId,
        multisigAddress: multisigAddress || undefined,
        limit: batchSize,
        startAfter: pageParam,
        types,
        executionState,
      };

      const { transactions: txs } = await client.Transactions(req);

      const parsedTxs: ParsedTransaction[] = [];
      for (const tx of txs) {
        try {
          switch (tx.chainType) {
            case "gno": {
              const msgs = decodeTxMessages(
                tx.msgs.map((msg) => {
                  return {
                    type_url: msg.typeUrl,
                    value: msg.value,
                  };
                }),
              );
              // eslint-disable-next-line no-restricted-syntax
              const tf = TxFee.fromJSON(JSON.parse(tx.feeJson));
              const t: ParsedTransaction = {
                ...tx,
                msgs,
                fee: {
                  // XXX: using cosmos's StdFee for now but could be improved
                  amount: [
                    {
                      amount: tf.gas_fee.split("ugnot")[0].toString(), // TODO: properly parse coin
                      denom: "ugnot",
                    },
                  ],
                  gas: tf.gas_wanted.toString(),
                },
                createdAt: new Date(tx.createdAt),
              };
              parsedTxs.push(t);
              break;
            }
            case "cosmos": {
              const msgs: EncodeObject[] = tx.msgs.map((m) => ({
                typeUrl: m.typeUrl,
                value: cosmosTypesRegistry.decode(m),
              }));
              const t: ParsedTransaction = {
                ...tx,
                msgs,
                // FIXME: sanitize
                // eslint-disable-next-line no-restricted-syntax
                fee: JSON.parse(tx.feeJson),
                createdAt: new Date(tx.createdAt),
              };
              parsedTxs.push(t);
              break;
            }
            default: {
              throw new Error(`unknown chain type ${tx.chainType}`);
            }
          }
        } catch {
          continue;
        }
      }

      return {
        data: parsedTxs,
        next: txs.length > 0 ? txs[txs.length - 1]?.createdAt : pageParam,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.next,
      staleTime: Infinity,
    },
  );
};
