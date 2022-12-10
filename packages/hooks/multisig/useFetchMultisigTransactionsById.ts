import { useInfiniteQuery } from "@tanstack/react-query";

import { MultisigTransactionType } from "../../screens/Multisig/types";
import { transactionsByMultisigId } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbSignature, DbTransaction } from "../../utils/founaDB/multisig/types";

export type MultisigTransactionListType = {
  _id: string;
  dataJSON: DbTransaction;
  signatures: DbSignature[];
  txHash: string;
  type: MultisigTransactionType;
  createdBy?: string;
  createdAt: string;
};

export const useFetchMultisigTransactionsById = (
  multisigId: string,
  type: "" | MultisigTransactionType = "",
  size: number
) => {
  //  request
  const request = useInfiniteQuery<{
    data: MultisigTransactionListType[];
    after: string;
  }>(
    ["multisig-transactions", multisigId, type],
    async ({ pageParam }) => {
      const saveRes = await transactionsByMultisigId(
        multisigId,
        type,
        size,
        pageParam
      );
      const { after, data } = saveRes.data.data.transactionsByMultisigId;

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
    }
  );

  return request;
};
