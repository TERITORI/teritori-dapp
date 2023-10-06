import { useQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import {
  getCosmosNetwork,
  getCosmosNetworkByChainId,
  parseUserId,
} from "../../networks";
import useSelectedWallet from "../useSelectedWallet";

export const useMultisigTransactionsCounts = (
  userId: string | undefined,
  multisigUserId: string | undefined
) => {
  const walletAccount = useSelectedWallet();
  const [network] = parseUserId(userId);
  const chainId = getCosmosNetwork(network?.id)?.chainId;
  const [, multisigAddress] = parseUserId(multisigUserId);
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

  return { transactionsCounts, ...others };
};
