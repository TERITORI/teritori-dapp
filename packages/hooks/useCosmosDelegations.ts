import { useQuery } from "@tanstack/react-query";

import { parseUserId, NetworkKind } from "../networks";

export const useCosmosDelegations = (userId: string | undefined) => {
  return useQuery(
    ["cosmosDelegations", userId],
    async () => {
      const [network, userAddress] = parseUserId(userId);
      if (network?.kind !== NetworkKind.Cosmos) {
        return [];
      }
      const delegations: any[] = []; // FIXME: type this
      let nextKey = "";
      while (true) {
        const httpResponse = await fetch(
          `${
            network.restEndpoint
          }/cosmos/staking/v1beta1/delegations/${userAddress}?pagination.key=${encodeURIComponent(
            nextKey
          )}`
        );
        const response = await httpResponse.json();
        delegations.push(...response.delegation_responses);
        if (!response.pagination.next_key) {
          break;
        }
        nextKey = response.pagination.next_key;
      }
      return delegations;
    },
    { enabled: !!userId }
  );
};
