import { z } from "zod";

export interface CosmosDelegationsResponse {
  delegation_responses: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string;
    };
    balance: {
      denom: string;
      amount: string;
    };
  }[];
}

export const zodCosmosRewardsResponse = z.object({
  total: z.array(
    z.object({
      denom: z.string(),
      amount: z.string(),
    }),
  ),
  rewards: z.array(
    z.object({
      validator_address: z.string(),
      reward: z.array(
        z.object({
          denom: z.string(),
          amount: z.string(),
        }),
      ),
    }),
  ),
});

export type CosmosRewardsResponse = z.infer<typeof zodCosmosRewardsResponse>;

export interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}
