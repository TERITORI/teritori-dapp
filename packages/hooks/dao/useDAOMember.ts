import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { mustGetNonSigningCosmWasmClient, parseUserId } from "../../networks";

export const useDAOMember = (
  daoId: string | undefined,
  userId: string | undefined
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
    { staleTime: Infinity, enabled: !!(networkId && groupAddress && userId) }
  );
};

export const useIsDAOMember = (
  daoId: string | undefined,
  userId: string | undefined
) => {
  const { data: member, ...other } = useDAOMember(daoId, userId);
  return {
    isDAOMember: member === undefined ? undefined : (member?.weight ?? 0) > 0,
    ...other,
  };
};
