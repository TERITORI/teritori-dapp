import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { ExecutionState, Transaction } from "../../api/multisig/v1/multisig";
import {
  cosmosTypesRegistry,
  getCosmosNetwork,
  parseUserId,
} from "../../networks";

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
      const chainId = getCosmosNetwork(network?.id)?.chainId;

      if (!chainId || !authToken) {
        return { data: [], next: null };
      }

      const [, multisigAddress] = parseUserId(multisigUserId);

      const req = {
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
