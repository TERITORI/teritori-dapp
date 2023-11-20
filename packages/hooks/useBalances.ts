import { Decimal } from "@cosmjs/math";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import {
  getNativeCurrency,
  getNetwork,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
} from "../networks";
import { Balance } from "../utils/coins";
import { getEthereumProvider } from "../utils/ethereum";
import { CosmosBalancesResponse } from "../utils/teritori";

export const useBalances = (
  networkId: string | undefined,
  address: string | undefined,
) => {
  const { data: networkBalances } = useQuery(
    ["balances", networkId, address],
    async () => {
      if (!address || !networkId) {
        return [];
      }
      // Ensuring with uses the wallet address that corresponds to the network
      const network = getNetwork(networkId);
      if (
        network?.kind === NetworkKind.Cosmos &&
        !address.includes(network.addressPrefix)
      ) {
        return [];
      }

      return await getNetworkBalances(networkId, address);
    },
    { initialData: [], refetchInterval: 30000 },
  );

  const { prices } = useCoingeckoPrices(
    networkBalances.map((bal) => ({ networkId, denom: bal.denom })),
  );

  const finalBalances = useMemo(() => {
    const balances = networkBalances.map((bal) => {
      const currency = getNativeCurrency(networkId, bal.denom);
      const price =
        currency &&
        Decimal.fromAtomics(
          bal.amount,
          currency.decimals,
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
  address: string,
): Promise<{ amount: string; denom: string }[]> => {
  const network = getNetwork(networkId);
  if (!network) {
    return [];
  }

  switch (network.kind) {
    case NetworkKind.Ethereum: {
      const provider = await getEthereumProvider(network);
      if (!provider) return [];

      const balance = await provider.getBalance(address);

      const balanceItem = {
        amount: balance.toString(),
        denom: WEI_TOKEN_ADDRESS,
      };
      return [balanceItem];
    }

    case NetworkKind.Cosmos: {
      const response = await fetch(
        `${network.restEndpoint}/cosmos/bank/v1beta1/balances/${address}`,
      );
      const responseJSON: CosmosBalancesResponse = await response.json();
      return responseJSON.balances || [];
    }

    case NetworkKind.Gno: {
      const res = await (window as any).adena.GetAccount();
      return [
        {
          amount:
            res?.data?.coins?.substring(0, res?.data?.coins?.length - 5) || "0",
          denom: "ugnot",
        },
      ];
    }

    default:
      return [];
  }
};
