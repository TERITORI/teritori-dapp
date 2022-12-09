import { useInfiniteQuery } from "@tanstack/react-query";

import { MultisigTransactionType } from "../screens/Multisig/types";
import { transactionsByMultisigId } from "../utils/founaDB/multisig/multisigGraphql";
import { DbSignature, DbTransaction } from "../utils/founaDB/multisig/types";

export type MultisigTransactionListType = {
  _id: string;
  dataJSON: DbTransaction;
  signatures: DbSignature[];
  txHash: string;
  type: MultisigTransactionType;
};

export const useFetchMultisigTransactions = (
  userAddress: string,
  type: "" | MultisigTransactionType = ""
) => {
  //  request
  const request = useInfiniteQuery<{
    data: MultisigTransactionListType[];
    after: string;
  }>(
    ["multisig-transactions", userAddress, type],
    async () => {
      const saveRes = await transactionsByMultisigId(userAddress, type);
      const { after, data } = saveRes.data.data.transactionsByMultisigId;
      console.log("saveRes", saveRes);

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
