import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  MultisigTransactionListType,
  MultisigTransactionResponseType,
} from "./useFetchMultisigTransactionsById";
import { NetworkKind } from "../../networks";
import { transactionsByUserAddress } from "../../utils/faunaDB/multisig/multisigGraphql";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

export const useFetchMultisigTransactionsByAddress = (userAddress: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const chainId = useMemo(() => {
    if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
      return "";
    }
    return selectedNetworkInfo.chainId;
  }, [selectedNetworkInfo?.chainId, selectedNetworkInfo?.kind]);

  //  request
  return useInfiniteQuery<{
    data: MultisigTransactionListType[];
    after: string;
  }>(
    ["multisig-transactions", userAddress, chainId],
    async () => {
      if (!userAddress) {
        return { data: [], after: "" };
      }
      const saveRes = await transactionsByUserAddress(userAddress, chainId, 5);

      const { after, data } = saveRes.data.data.transactionsByUserAddress;

      return {
        data: data.map((s: MultisigTransactionResponseType) => ({
          ...s,
          msgs: JSON.parse(s.msgs),
          // We use a JSON.parse fallback because some fee are "auto" in DB (Unexpected, but need this fallback to avoid error)
          fee: () => {
            try {
              return JSON.parse(s.fee);
            } catch {
              return s.fee;
            }
          },
        })),
        after,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.after,
      refetchOnWindowFocus: false,
    }
  );
};
