import { useInfiniteQuery } from "@tanstack/react-query";

import {
  MultisigTransactionType,
  MultisigType,
} from "../../screens/Multisig/types";
import { transactionsByMultisigId } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbSignature, DbTransaction } from "../../utils/founaDB/multisig/types";
import useSelectedWallet from "../useSelectedWallet";

export type MultisigTransactionListType = {
  _id: string;
  dataJSON: DbTransaction;
  signatures: { data: DbSignature[] };
  txHash: string;
  type: MultisigTransactionType;
  createdBy?: string;
  createdAt: string;
  recipientAddress: string;
  decliners?: string[];
  multisig: MultisigType;
};

export const useFetchMultisigTransactionsById = (
  multisigId: string,
  type: "" | MultisigTransactionType = "",
  size: number
) => {
  // variables
  const wallet = useSelectedWallet();

  //  request
  const request = useInfiniteQuery<{
    data: MultisigTransactionListType[];
    after: string;
  }>(
    ["multisig-transactions", multisigId, type, wallet?.address],
    async ({ pageParam }) => {
      const saveRes = await transactionsByMultisigId(
        multisigId,
        type,
        size,
        pageParam
      );
      const { after, data } = saveRes?.data?.data?.transactionsByMultisigId || {
        after: null,
        data: [],
      };

      return {
        data: data.map(
          (s: MultisigTransactionListType & { dataJSON: string }) => ({
            ...s,
            dataJSON: JSON.parse(s.dataJSON),
          })
        ),
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
