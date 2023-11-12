import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "../../networks";
import { getSquadStakingQueryClient } from "../../utils/contracts";

export const useSquadStakingSquadsV2 = (userId: string | undefined) => {
  return useQuery(
    ["squadStakingSquadsV2", userId],
    async () => {
      const [network, address] = parseUserId(userId);
      if (!network || !address) {
        return [];
      }
      try {
        const queryClient = await getSquadStakingQueryClient(network.id);
        return await queryClient.getSquad({ owner: address });
      } catch (e) {
        if (e instanceof Error && e.message.includes("Squad not found")) {
          return [];
        } else {
          throw e;
        }
      }
    },
    { initialData: [] },
  );
};
