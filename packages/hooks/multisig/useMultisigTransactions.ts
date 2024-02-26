import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useMultisigClient } from "./useMultisigClient";

import { ExecutionState, Transaction } from "@/api/multisig/v1/multisig";
import { getCosmosNetwork, parseUserId } from "@/networks";
import { cosmosTypesRegistry } from "@/networks/signer";
import { zodMustParseJSON } from "@/utils/sanitize";

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

const zodCosmosFee = z.object({
  gas: z.string(),
  amount: z.array(z.object({ amount: z.string(), denom: z.string() })),
});

export const useMultisigTransactions = (
  userId: string | undefined,
  multisigUserId: string | undefined,
  types: string[],
  executionState: ExecutionState,
) => {
  const [network] = parseUserId(userId);
  const client = useMultisigClient(network?.id);

  return useInfiniteQuery(
    [
      ...multisigTransactionsQueryKey(network?.id, multisigUserId),
      types,
      executionState,
      client,
    ],
    async ({ pageParam }) => {
      const chainId = getCosmosNetwork(network?.id)?.chainId;

      if (!chainId || !client) {
        return { data: [], next: null };
      }

      const [, multisigAddress] = parseUserId(multisigUserId);

      const req = {
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
          const fee = zodMustParseJSON(zodCosmosFee, tx.feeJson);
          const t: ParsedTransaction = {
            ...tx,
            msgs,
            fee,
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
