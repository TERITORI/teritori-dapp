import { useQuery } from "@tanstack/react-query";

import { useDAOGroup } from "./useDAOGroup";
import { Cw4GroupQueryClient } from "../../contracts-clients/cw4-group/Cw4Group.client";
import { parseUserId, mustGetNonSigningCosmWasmClient } from "../../networks";

// FIXME: pagination

export const useDAOMembers = (daoId: string | undefined) => {
  const [network] = parseUserId(daoId);
  const { data: daoGroupAddress } = useDAOGroup(daoId);
  const { data: members, ...other } = useQuery(
    ["daoMembers", network?.id, daoGroupAddress],
    async () => {
      if (!network?.id || !daoGroupAddress) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);
      const cw4Client = new Cw4GroupQueryClient(
        cosmwasmClient,
        daoGroupAddress
      );
      const { members } = await cw4Client.listMembers({ limit: 100 });
      return members;
    },
    { staleTime: Infinity, enabled: !!(network?.id && daoGroupAddress) }
  );
  return { members, ...other };
};
