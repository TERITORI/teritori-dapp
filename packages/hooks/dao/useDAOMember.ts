import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const useDAOMember = (
  daoId: string | undefined,
  userId: string | undefined,
  enabled?: boolean
) => {
  const { data: groupAddress } = useDAOGroup(daoId);
  const [network] = parseUserId(daoId);
  const networkId = network?.id;
  return useQuery(
    ["daoMember", networkId, groupAddress, userId],
    async () => {
      const [, userAddress] = parseUserId(userId);
      if (!networkId || !groupAddress || !userAddress) return null;
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const groupClient = new Cw4GroupQueryClient(cosmwasmClient, groupAddress);
      return await groupClient.member({ addr: userAddress });
    },
    {
      staleTime: Infinity,
      enabled: !!((enabled ?? true) && networkId && groupAddress && userId),
    }
  );
};

export const useIsDAOMember = (
  daoId: string | undefined,
  userId: string | undefined,
  enabled?: boolean
) => {
  const { data: member, ...other } = useDAOMember(daoId, userId, enabled);
  return {
    isDAOMember: member === undefined ? undefined : (member?.weight ?? 0) > 0,
    ...other,
  };
};
