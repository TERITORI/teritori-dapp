import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import {
  getCosmosNetwork,
  getNativeCurrency,
  getNetwork,
  NetworkKind,
} from "../networks";
import { Balance } from "../utils/coins";
import { CosmosDelegationsResponse } from "../utils/teritori";

const initialData = { delegation_responses: [] };

export const useDelegations = (
  networkId: string | undefined,
  address: string | undefined,
) => {
  const { data: networkDelegations } = useQuery(
    ["delegations", networkId, address],
    async () => {
      if (!address || !networkId) {
        return initialData;
      }
      // Ensuring with uses the wallet address that corresponds to the network
      const network = getNetwork(networkId);
      if (
        network?.kind === NetworkKind.Cosmos &&
        !address.includes(network.addressPrefix)
      ) {
        return initialData;
      }
      return getNetworkDelegations(networkId, address);
    },
    { initialData, refetchInterval: 30000 },
  );

  const delegations =
    networkDelegations.delegation_responses || initialData.delegation_responses;

  const { prices } = useCoingeckoPrices(
    delegations.map((deleg) => ({
      networkId,
      denom: deleg.balance.denom,
    })),
  );

  // Same pattern as useBalances
  const finalDelegationsBalances = useMemo(() => {
    const balances = delegations.map((deleg) => {
      const currency = getNativeCurrency(networkId, deleg.balance.denom);
      const price =
        currency &&
        Decimal.fromAtomics(
          deleg.balance.amount,
          currency.decimals,
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
  }, [delegations, networkId, prices]);

  return { delegationsBalances: finalDelegationsBalances };
};

// Returns the delegations from cosmos API
const getNetworkDelegations = async (
  networkId: string,
  address: string,
): Promise<CosmosDelegationsResponse> => {
  const network = getCosmosNetwork(networkId);
  if (!network) {
    return initialData;
  }
  const response = await fetch(
    `${network.restEndpoint}/cosmos/staking/v1beta1/delegations/${address}`,
  );
  return await response.json();
};
