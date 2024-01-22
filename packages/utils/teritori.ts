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

export interface CosmosRewardsResponse {
  total: {
    denom: string;
    amount: string;
  }[];
  rewards: {
    validator_address: string;
    reward: {
      denom: string;
      amount: string;
    }[];
  }[];
}

export interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}
