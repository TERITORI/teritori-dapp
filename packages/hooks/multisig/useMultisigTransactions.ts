import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { ExecutionState, Transaction } from "../../api/multisig/v1/multisig";
import { cosmosTypesRegistry } from "../../networks";
import { tryParseJSON } from "../../utils/jsons";

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
  chainId: string | undefined,
  multisigAddress: string | undefined
) => ["multisig-transactions", chainId, multisigAddress];

export const useMultisigTransactions = (
  chainId: string | undefined,
  multisigAddress: string | undefined,
  userId: string | undefined,
  types: string[],
  executionState: ExecutionState
) => {
  const authToken = useMultisigAuthToken(userId);
  const client = useMultisigClient();

  //  request
  return useInfiniteQuery(
    [
      ...multisigTransactionsQueryKey(chainId, multisigAddress),
      types,
      executionState,
      authToken,
    ],
    async ({ pageParam }) => {
      console.log(
        "fetching",
        pageParam,
        chainId,
        multisigAddress,
        authToken,
        types
      );

      if (!chainId || !authToken) {
        return { data: [], next: null };
      }

      const req = {
        authToken,
        chainId,
        multisigAddress,
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
            fee: tryParseJSON(tx.feeJson || "{}"),
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
    }
  );
};
