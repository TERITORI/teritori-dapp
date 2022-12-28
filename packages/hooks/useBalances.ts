import { useQuery } from "@tanstack/react-query";
import { Decimal } from "cosmwasm";
import { ethers } from "ethers";
import { useMemo } from "react";

import { getNativeCurrency, getNetwork } from "../networks";
import { Balance } from "../utils/coins";
import { Network } from "../utils/network";
import { CosmosBalancesResponse } from "../utils/teritori";
import { useCoingeckoPrices } from "./useCoingeckoPrices";

export const useBalances = (
  networkId: string | undefined,
  address: string | undefined
) => {
  const { data: networkBalances } = useQuery(
    ["balances", networkId, address],
    async () => {
      if (!address || !networkId) {
        return [];
      }

      return getNetworkBalances(networkId, address);
    },
    { initialData: [], refetchInterval: 5000 }
  );

  const { prices } = useCoingeckoPrices(
    networkBalances.map((bal) => ({ networkId, denom: bal.denom }))
  );

  const finalBalances = useMemo(() => {
    const balances = networkBalances.map((bal) => {
      const currency = getNativeCurrency(networkId, bal.denom);
      const price =
        currency &&
        Decimal.fromAtomics(
          bal.amount,
          currency.decimals
        ).toFloatApproximation() * (prices[currency.coingeckoId]?.usd || 0);
      const balance: Balance = {
        amount: bal.amount,
        denom: bal.denom,
        usdAmount: price,
      };
      return balance;
    });

    balances.sort((a, b) => (b.usdAmount || 0) - (a.usdAmount || 0));

    return balances;
  }, [networkId, networkBalances, prices]);

  return finalBalances;
};

const getNetworkBalances = async (
  networkId: string,
  address: string
): Promise<{ amount: string; denom: string }[]> => {
  const network = getNetwork(networkId);
  if (!network) {
    return [];
  }

  // Support for ethereum balances
  if (network.network === Network.Ethereum) {
    const provider = ethers.getDefaultProvider(+network.chainId, {
      alchemy: process.env.ALCHEMY_API_KEY,
    });
    // Prevent etherjs from polling network to get event, we do not need in this case
    provider.pollingInterval = 60_000;

    const balance = await provider.getBalance(address);

    const balanceItem = {
      amount: balance.toString(),
      denom: network.currencies[0].denom,
    };
    return [balanceItem];
  }
  // Support for cosmos balances
  else if (network.network === Network.Teritori) {
    const response = await fetch(
      `${network.restEndpoint}/cosmos/bank/v1beta1/balances/${address}`
    );
    const responseJSON: CosmosBalancesResponse = await response.json();
    return responseJSON.balances;
  }
  // Unsupported network
  else {
    console.error(`unsupported network ${network.network}`);
    return [];
  }
};
