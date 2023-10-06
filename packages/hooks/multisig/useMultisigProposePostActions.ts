import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { multisigTransactionsQueryKey } from "./useMultisigTransactions";
import { NetworkKind, parseUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";

export const useMultisigProposePostActions = (
  multisigId: string | undefined
) => {
  const { navigate } = useAppNavigation();
  const queryClient = useQueryClient();
  return useCallback(async () => {
    const [network, userAddress] = parseUserId(multisigId);
    if (network?.kind === NetworkKind.Cosmos) {
      const chainId = network.chainId;
      await queryClient.invalidateQueries(
        multisigTransactionsQueryKey(chainId, userAddress)
      );
      await queryClient.invalidateQueries(
        multisigTransactionsQueryKey(chainId, undefined)
      );
    }
    if (multisigId) {
      navigate("MultisigWalletDashboard", { id: multisigId });
    }
  }, [multisigId, navigate, queryClient]);
};
