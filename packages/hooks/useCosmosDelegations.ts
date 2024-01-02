import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { parseUserId, NetworkKind } from "../networks";

const zodCosmosDelegation = z.object({
  delegation: z.object({
    delegator_address: z.string(),
    validator_address: z.string(),
    shares: z.string(),
  }),
  balance: z.object({
    denom: z.string(),
    amount: z.string(),
  }),
});

type CosmosDelegation = z.infer<typeof zodCosmosDelegation>;

const zodCosmosDelegationsResponse = z.object({
  delegation_responses: z.array(zodCosmosDelegation),
  pagination: z.object({
    next_key: z.string().nullable(),
    total: z.string(),
  }),
});

export const useCosmosDelegations = (userId: string | undefined) => {
  return useQuery(
    ["cosmosDelegations", userId],
    async () => {
      const [network, userAddress] = parseUserId(userId);
      if (network?.kind !== NetworkKind.Cosmos) {
        return [];
      }
      const delegations: CosmosDelegation[] = [];
      let nextKey = "";
      while (true) {
        const httpResponse = await fetch(
          `${
            network.restEndpoint
          }/cosmos/staking/v1beta1/delegations/${userAddress}?pagination.key=${encodeURIComponent(
            nextKey,
          )}`,
        );
        const rawResponse = await httpResponse.json();
        const response = zodCosmosDelegationsResponse.parse(rawResponse);
        delegations.push(...response.delegation_responses);
        if (!response.pagination.next_key) {
          break;
        }
        nextKey = response.pagination.next_key;
      }
      return delegations;
    },
    { enabled: !!userId },
  );
};
