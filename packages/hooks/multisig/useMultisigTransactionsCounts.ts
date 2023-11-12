import { useQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { getCosmosNetwork, parseUserId } from "../../networks";
import useSelectedWallet from "../useSelectedWallet";

export const multisigTransactionsCountsQueryKey = (
  networkId: string | undefined,
) => ["multisig-transactions-counts", networkId];

export const useMultisigTransactionsCounts = (
  userId: string | undefined,
  multisigUserId: string | undefined,
) => {
  const walletAccount = useSelectedWallet();
  const authToken = useMultisigAuthToken(walletAccount?.userId);
  const [network] = parseUserId(userId);
  const multisigClient = useMultisigClient(network?.id);

  const { data: transactionsCounts, ...others } = useQuery(
    [
      ...multisigTransactionsCountsQueryKey(network?.id),
      multisigUserId,
      authToken,
      multisigClient,
    ],
    async () => {
      const cosmosNetwork = getCosmosNetwork(network?.id);
      if (!cosmosNetwork) {
        return null;
      }
      const [, multisigAddress] = parseUserId(multisigUserId);
      const counts = await multisigClient?.TransactionsCounts({
        authToken,
        chainId: cosmosNetwork.chainId,
        multisigAddress,
      });
      return counts;
    },
    { staleTime: Infinity },
  );

  return { transactionsCounts, ...others };
};
