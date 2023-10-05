import { useQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { getCosmosNetworkByChainId } from "../../networks";
import useSelectedWallet from "../useSelectedWallet";

export const useMultisigTransactionsCounts = (
  chainId: string | undefined,
  multisigAddress: string | undefined
) => {
  const walletAccount = useSelectedWallet();
  const authToken = useMultisigAuthToken(walletAccount?.userId);
  const multisigClient = useMultisigClient();

  const { data: transactionsCounts, ...others } = useQuery(
    [
      "multisig-transactions-counts",
      chainId,
      multisigAddress,
      authToken,
      multisigClient,
    ],
    async () => {
      const cosmosNetwork = getCosmosNetworkByChainId(chainId);
      if (!cosmosNetwork) {
        return null;
      }
      const counts = await multisigClient?.TransactionsCounts({
        authToken,
        chainId,
        multisigAddress,
      });
      console.log("counts", counts);
      return counts;
    },
    { staleTime: Infinity }
  );

  // returns
  return { transactionsCounts, ...others };
};
