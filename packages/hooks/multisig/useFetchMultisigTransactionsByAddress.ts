import { useInfiniteQuery } from "@tanstack/react-query";

import {
  MultisigTransactionListType,
  MultisigTransactionResponseType,
} from "./useFetchMultisigTransactionsById";
import { transactionsByUserAddress } from "../../utils/founaDB/multisig/multisigGraphql";

export const useFetchMultisigTransactionsByAddress = (
  userAddress: string,
  chainId: string
) => {
  //  request
  const request = useInfiniteQuery<{
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
          fee: JSON.parse(s.fee),
        })),
        after,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.after,
      refetchOnWindowFocus: false,
    }
  );

  return request;
};
