import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";

import { getNativeCurrency, getNetwork } from "../networks";
import { Balance } from "../utils/coins";
import { CosmosBalancesResponse } from "../utils/teritori";

export const useBalances = (
  networkId: string | undefined,
  address: string | undefined
) => {
  const { data } = useQuery(
    ["balances", networkId, address],
    async () => {
      if (!address || !networkId) {
        return [];
      }

      const networkBalances = await getNetworkBalances(networkId, address);

      const ids = networkBalances
        .map((bal) => getNativeCurrency(networkId, bal.denom)?.coingeckoId)
        .filter((id) => !!id);

      const prices = await (
        await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
            ids.join(",")
          )}&vs_currencies=usd`
        )
      ).json();

      const balances = networkBalances.map((bal) => {
        const currency = getNativeCurrency(networkId, bal.denom);
        const price =
          currency &&
          Decimal.fromAtomics(
            bal.amount,
            currency.decimals
          ).toFloatApproximation() * prices[currency.coingeckoId].usd;
        const balance: Balance = {
          amount: bal.amount,
          denom: bal.denom,
          usdAmount: price,
        };
        return balance;
      });

      balances.sort((a, b) => (b.usdAmount || 0) - (a.usdAmount || 0));

      return balances;
    },
    { initialData: [], refetchInterval: 5000 }
  );

  return data;
};

const getNetworkBalances = async (
  networkId: string,
  address: string
): Promise<{ amount: string; denom: string }[]> => {
  const network = getNetwork(networkId);
  if (!network) {
    return [];
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/bank/v1beta1/balances/${address}`
  );
  const responseJSON: CosmosBalancesResponse = await response.json();
  return responseJSON.balances;
};
