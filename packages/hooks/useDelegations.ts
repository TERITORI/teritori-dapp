import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { useMemo } from "react";

import { getNativeCurrency, getNetwork } from "../networks";
import { Balance } from "../utils/coins";
import { Network } from "../utils/network";
import { CosmosDelegationsResponse } from "../utils/teritori";
import { useCoingeckoPrices } from "./useCoingeckoPrices";

const initialData = { delegation_responses: [] };

export const useDelegations = (
  networkId: string | undefined,
  address: string | undefined
) => {
  const { data: networkDelegations } = useQuery(
    ["delegations", networkId, address],
    async () => {
      if (!address || !networkId) {
        return initialData;
      }
      return getNetworkDelegations(networkId, address);
    },
    { initialData, refetchInterval: 5000 }
  );

  const { prices } = useCoingeckoPrices(
    networkDelegations.delegation_responses.map((deleg) => ({
      networkId,
      denom: deleg.balance.denom,
    }))
  );

  // Same pattern as useBalances
  const finalDelegationsBalances = useMemo(() => {
    const balances = networkDelegations.delegation_responses.map((deleg) => {
      const currency = getNativeCurrency(networkId, deleg.balance.denom);
      const price =
        currency &&
        Decimal.fromAtomics(
          deleg.balance.amount,
          currency.decimals
        ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0);
      const balance: Balance = {
        amount: deleg.balance.amount,
        denom: deleg.balance.denom,
        usdAmount: price,
      };
      return balance;
    });
    balances.sort((a, b) => (b.usdAmount || 0) - (a.usdAmount || 0));
    return balances;
  }, [networkId, networkDelegations, prices]);

  return { delegationsBalances: finalDelegationsBalances };
};

// Returns the delegations from cosmos API
const getNetworkDelegations = async (
  networkId: string,
  address: string
): Promise<CosmosDelegationsResponse> => {
  const network = getNetwork(networkId);
  if (!network || network.network === Network.Ethereum) {
    return initialData;
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/staking/v1beta1/delegations/${address}`
  );
  return await response.json();
};
