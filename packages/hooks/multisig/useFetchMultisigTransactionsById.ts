import { StdFee } from "@cosmjs/amino";
import { EncodeObject } from "@cosmjs/proto-signing";
import { useQuery } from "@tanstack/react-query";

import {
  MultisigTransactionType,
  MultisigType,
} from "../../screens/Multisig/types";
import { transactionsByMultisigId } from "../../utils/faunaDB/multisig/multisigGraphql";
import { DbSignature } from "../../utils/faunaDB/multisig/types";
import { tryParseJSON } from "../../utils/jsons";
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
  isError?: boolean;
}

export interface MultisigTransactionResponseType
  extends Omit<MultisigTransactionListType, "msgs" | "fee"> {
  msgs: string;
  fee: string;
}

export const useFetchMultisigTransactionsById = (
  multisigId: string,
  type: "" | MultisigTransactionType = "",
  after: string | null,
  size: number
) => {
  const { selectedWallet: wallet } = useSelectedWallet();

  //  request
  return useQuery<{
    data: MultisigTransactionListType[];
    after: string | null;
    before: string | null;
  }>(
    ["multisig-transactions", multisigId, type, wallet?.address, after],
    async () => {
      const saveRes = await transactionsByMultisigId(
        multisigId,
        type,
        size,
        after
      );
      const {
        after: afterData,
        before,
        data,
      } = saveRes?.data?.data?.transactionsByMultisigId || {
        after: null,
        before: null,
        data: [],
      };

      return {
        data: data.map((s: MultisigTransactionResponseType) => ({
          ...s,
          msgs: tryParseJSON(s.msgs),
          fee: tryParseJSON(s.fee),
          isError: isMultisigTransactionResponseError(s),
        })),
        after: afterData,
        before,
      };
    }
  );
};

// For now, we consider TX as error if the msgs or fee are not valid JSON
export const isMultisigTransactionResponseError = (
  s: MultisigTransactionResponseType
) => {
  console.log(
    'typeof tryParseJSON(s.fee) !== "object"typeof tryParseJSON(s.fee) !== "object"typeof tryParseJSON(s.fee) !== "object"',
    typeof tryParseJSON(s.fee) !== "object"
  );
  return (
    typeof tryParseJSON(s.msgs) !== "object" ||
    typeof tryParseJSON(s.fee) !== "object"
  );
};
