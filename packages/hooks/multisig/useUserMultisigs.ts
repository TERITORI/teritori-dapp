import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { useMultisigClient } from "./useMultisigClient";
import { JoinState } from "../../api/multisig/v1/multisig";
import { NetworkKind, parseUserId } from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";

const batchSize = 100;

export const useUserMultisigs = (
  userId: string | undefined,
  joinState?: JoinState
) => {
  const [network, userAddress] = parseUserId(userId);
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, userAddress)
  );
  const multisigClient = useMultisigClient();
  const { data, ...other } = useQuery(
    ["userMultisigs", userId, authToken, multisigClient, joinState],
    async () => {
      if (network?.kind !== NetworkKind.Cosmos) {
        return [];
      }
      if (!authToken) {
        return [];
      }
      const { multisigs } = await multisigClient.Multisigs({
        limit: batchSize,
        authToken,
        joinState,
        chainId: network.chainId,
      });
      return multisigs;
    },
    { initialData: [] }
  );
  return { multisigs: data || [], ...other };
};
