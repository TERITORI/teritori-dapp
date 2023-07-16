import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  TransactionFieldsFragment,
  useGetUserTransactionsQuery,
} from "../../api/multisig";
import { NetworkKind } from "../../networks";
import { fetcherConfig } from "../../utils/faunaDB/multisig/multisigGraphql";
import { tryParseJSON } from "../../utils/jsons";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

export const useFetchMultisigTransactionsByAddress = (
  userAddress: string,
  size: number = 20
) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const chainId = useMemo(() => {
    if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
      return "";
    }
    return selectedNetworkInfo.chainId;
  }, [selectedNetworkInfo?.chainId, selectedNetworkInfo?.kind]);

  //  request
  return useInfiniteQuery(
    ["multisig-transactions", userAddress, chainId],
    async ({ pageParam }) => {
      if (!userAddress) {
        return { data: [], next: null };
      }

      let transactions: TransactionFieldsFragment[];
      let err: unknown;

      try {
        const { transactions: txs } = await useGetUserTransactionsQuery.fetcher(
          fetcherConfig,
          {
            chainId,
            userAddress,
            size,
            before: pageParam || null,
          }
        )();
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
    }
  );
};
