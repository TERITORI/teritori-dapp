import { StdFee } from "@cosmjs/stargate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  MultisigServiceClientImpl,
  GrpcWebImpl as MultisigGrpcWebImpl,
  Transaction,
  TransactionsRequest,
} from "../../api/multisig/v1/multisig";
import { NetworkKind } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { tryParseJSON } from "../../utils/jsons";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

const rpc = new MultisigGrpcWebImpl("http://localhost:9091", {
  debug: false,
});
const client = new MultisigServiceClientImpl(rpc);

export type ParsedTransaction = Omit<
  Transaction,
  "createdAt" | "msgs" | "fee"
> & {
  createdAt: Date;
  msgs: any[]; // FIXME: replace by unknown
  fee: StdFee;
};

export const useFetchMultisigTransactionsByAddress = (
  userAddress: string,
  size: number = 20
) => {
  const authToken = useSelector(selectMultisigToken);
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const chainId = useMemo(() => {
    if (selectedNetworkInfo?.kind !== NetworkKind.Cosmos) {
      return "";
    }
    return selectedNetworkInfo.chainId;
  }, [selectedNetworkInfo?.chainId, selectedNetworkInfo?.kind]);

  //  request
  return useInfiniteQuery(
    ["multisig-transactions", userAddress, chainId, authToken],
    async ({ pageParam }) => {
      if (!userAddress) {
        return { data: [], next: null };
      }

      const req: Partial<TransactionsRequest> = {
        authToken,
        // chainId, // FIXME: correctly pass chainId during creation
        limit: size,
        startAfter: pageParam,
      };
      console.log("req", req);
      const { transactions: txs } = await client.Transactions(req);
      console.log("txs", txs);

      return {
        data: txs.map((s) => {
          const pt: ParsedTransaction = {
            ...s,
            msgs: tryParseJSON(s.msgsJson || "[]"),
            fee: tryParseJSON(s.feeJson || "{}"),
            createdAt: new Date(s.createdAt),
          };
          return pt;
        }),
        next:
          txs.length > 0
            ? txs[txs.length - 1].createdAt
            : pageParam || undefined,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.next,
      refetchOnWindowFocus: false,
    }
  );
};
