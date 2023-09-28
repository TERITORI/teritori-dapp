import { EncodeObject } from "@cosmjs/proto-signing";
import { StdFee } from "@cosmjs/stargate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { useMultisigClient } from "./useMultisigClient";
import { ExecutionState, Transaction } from "../../api/multisig/v1/multisig";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";
import { tryParseJSON } from "../../utils/jsons";

const batchSize = 16;

export type ParsedTransaction = Omit<
  Transaction,
  "createdAt" | "msgs" | "fee"
> & {
  createdAt: Date;
  msgs: EncodeObject[];
  fee: StdFee;
};

export const multisigTransactionsQueryKey = (
  chainId: string | undefined,
  multisigAddress: string | undefined
) => ["multisig-transactions", chainId, multisigAddress];

export const useMultisigTransactions = (
  chainId: string | undefined,
  multisigAddress: string | undefined,
  userAddress: string | undefined,
  types: string[],
  executionState: ExecutionState
) => {
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, userAddress)
  );
  const client = useMultisigClient();

  //  request
  return useInfiniteQuery(
    [
      ...multisigTransactionsQueryKey(chainId, multisigAddress),
      types,
      executionState,
      authToken,
    ],
    async ({ pageParam }) => {
      console.log(
        "fetching",
        pageParam,
        chainId,
        multisigAddress,
        authToken,
        types
      );

      if (!chainId || !authToken) {
        return { data: [], next: null };
      }

      const req = {
        authToken,
        chainId,
        multisigAddress,
        limit: batchSize,
        startAfter: pageParam,
        types,
        executionState,
      };

      const { transactions: txs } = await client.Transactions(req);

      return {
        data: txs.map((s) => {
          const t: ParsedTransaction = {
            ...s,
            msgs: tryParseJSON(s.msgsJson || "[]"),
            fee: tryParseJSON(s.feeJson || "{}"),
            createdAt: new Date(s.createdAt),
          };
          return t;
        }),
        next: txs.length > 0 ? txs[txs.length - 1]?.createdAt : pageParam,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.next,
      staleTime: Infinity,
    }
  );
};
