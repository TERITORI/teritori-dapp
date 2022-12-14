import { useInfiniteQuery } from "@tanstack/react-query";

import { transactionsByUserAddress } from "../../utils/founaDB/multisig/multisigGraphql";
import {
  MultisigTransactionListType,
  MultisigTransactionResponseType,
} from "./useFetchMultisigTransactionsById";

export const useFetchMultisigTransactionsByAddress = (userAddress: string) => {
  //  request
  const request = useInfiniteQuery<{
    data: MultisigTransactionListType[];
    after: string;
  }>(
    ["multisig-transactions", userAddress],
    async () => {
      const saveRes = await transactionsByUserAddress(userAddress, 5);

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
