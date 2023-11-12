import { useQuery } from "@tanstack/react-query";

import { getSquadStakingQueryClient } from "../../utils/contracts";

export const useSquadStakingConfig = (networkId: string | undefined) => {
  return useQuery(
    ["squadStakingConfig", networkId],
    async () => {
      const squadStakingQueryClient =
        await getSquadStakingQueryClient(networkId);
      return await squadStakingQueryClient.getConfig();
    },
    { staleTime: Infinity },
  );
};
