import { EncodeObject } from "@cosmjs/proto-signing";
import { useInfiniteQuery } from "@tanstack/react-query";
import { StdFee } from "cosmwasm";

import {
  MultisigTransactionType,
  MultisigType,
} from "../../screens/Multisig/types";
import { transactionsByMultisigId } from "../../utils/founaDB/multisig/multisigGraphql";
import { DbSignature } from "../../utils/founaDB/multisig/types";
import useSelectedWallet from "../useSelectedWallet";

export interface MultisigTransactionListType {
  _id: string;
  signatures?: { data: DbSignature[] };
  txHash?: string;
  type: MultisigTransactionType;
  createdBy: string;
  createdAt: string;
  recipientAddress: string;
  decliners?: string[];
  multisig: MultisigType;
  accountNumber: number;
  sequence: number;
  chainId: string;
  msgs: EncodeObject[];
  fee: StdFee;
  memo: string;
}

export interface MultisigTransactionResponseType
  extends Omit<MultisigTransactionListType, "msgs" | "fee"> {
  msgs: string;
  fee: string;
}

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
