const restProvider = "http://176.9.19.162:1317";

interface CosmosBalancesResponse {
  balances: { denom: string; amount: string }[];
}

export const getCosmosBalances = async (address: string) => {
  const response = await fetch(
    `${restProvider}/cosmos/bank/v1beta1/balances/${address}`
  );
  const responseJSON: CosmosBalancesResponse = await response.json();
  return responseJSON;
};
