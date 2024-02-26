import { useQuery } from "@tanstack/react-query";

import { useMultisigClient } from "./useMultisigClient";

import { getCosmosNetwork, parseUserId } from "@/networks";

export const multisigTransactionsCountsQueryKey = (
  networkId: string | undefined,
) => ["multisig-transactions-counts", networkId];

export const useMultisigTransactionsCounts = (
  userId: string | undefined,
  multisigUserId: string | undefined,
) => {
  const [network] = parseUserId(userId);
  const multisigClient = useMultisigClient(network?.id);

  const { data: transactionsCounts, ...others } = useQuery(
    [
      ...multisigTransactionsCountsQueryKey(network?.id),
      multisigUserId,
      multisigClient,
    ],
    async () => {
      const cosmosNetwork = getCosmosNetwork(network?.id);
      if (!cosmosNetwork) {
        return null;
      }
      const [, multisigAddress] = parseUserId(multisigUserId);
      const counts = await multisigClient?.TransactionsCounts({
        chainId: cosmosNetwork.chainId,
        multisigAddress,
      });
      return counts || null;
    },
    { staleTime: Infinity },
  );

  return { transactionsCounts, ...others };
};
