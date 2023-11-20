import { useQuery } from "@tanstack/react-query";

import { useMultisigAuthToken } from "./useMultisigAuthToken";
import { useMultisigClient } from "./useMultisigClient";
import { JoinState } from "../../api/multisig/v1/multisig";
import { NetworkKind, parseUserId } from "../../networks";

const batchSize = 100;

export const userMultisigsQueryKey = (userId: string | undefined) => {
  return ["userMultisigs", userId];
};

export const useUserMultisigs = (
  userId: string | undefined,
  joinState?: JoinState,
) => {
  const [network] = parseUserId(userId);
  const authToken = useMultisigAuthToken(userId);
  const multisigClient = useMultisigClient(network?.id);
  const { data, ...other } = useQuery(
    [...userMultisigsQueryKey(userId), joinState, authToken, multisigClient],
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
    { staleTime: Infinity },
  );
  return { multisigs: data || [], ...other };
};
