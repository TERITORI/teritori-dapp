import { useInfiniteQuery } from "@tanstack/react-query";

import {
  TransactionFieldsFragment,
  useGetMultisigTransactionsQuery,
} from "../../api/multisig";
import { getCosmosNetwork, parseUserId } from "../../networks";
import { fetcherConfig } from "../../utils/faunaDB/multisig/multisigGraphql";
import { tryParseJSON } from "../../utils/jsons";

const batchSize = 16;

export const useFetchMultisigTransactionsById = (multisigId: string) => {
  const [network, multisigAddress] = parseUserId(multisigId);
  const cosmosNetwork = getCosmosNetwork(network?.id);
  const chainId = cosmosNetwork?.chainId;

  //  request
  return useInfiniteQuery(
    ["multisig-transactions", chainId, multisigAddress],
    async ({ pageParam }) => {
      console.log("getting a page", chainId, multisigAddress, pageParam);

      if (!chainId || !multisigAddress) {
        return { data: [], next: null };
      }

      let transactions: TransactionFieldsFragment[];
      let err: unknown;

      try {
        const { transactions: txs } =
          await useGetMultisigTransactionsQuery.fetcher(fetcherConfig, {
            chainId,
            multisigAddress,
            size: batchSize,
            before: pageParam || null,
          })();
        transactions = txs;
      } catch (e) {
        err = e;
        transactions = [];
      }

      return {
        data: transactions.map((s) => ({
          ...s,
          msgs: tryParseJSON(s.msgs || "[]"),
          fee: tryParseJSON(s.fee || "{}"),
          isError: !!err,
        })),
        next:
          transactions.length > 0
            ? new Date(
                Date.parse(transactions[transactions.length - 1]?.createdAt) - 1
              ).toISOString()
            : pageParam || null,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.next,
      refetchOnWindowFocus: false,
      enabled: !!chainId && !!multisigAddress,
    }
  );
};
