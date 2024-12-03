import { useQuery } from "@tanstack/react-query";

import { RakkiQueryClient } from "../../contracts-clients/rakki/Rakki.client";
import {
  NetworkFeature,
  getNetworkFeature,
  getNonSigningCosmWasmClient,
} from "../../networks";

export const useRakkiTicketsCountByUser = (
  networkId: string,
  userAddress?: string,
) => {
  const { data: ticketsCount = null, ...other } = useQuery(
    ["rakkiTicketsCountByUser", networkId],
    async () => {
      if (!userAddress) {
        return null;
      }
      const rakkiFeature = getNetworkFeature(
        networkId,
        NetworkFeature.CosmWasmRakki,
      );
      if (!rakkiFeature) {
        return null;
      }
      const cosmWasmClient = await getNonSigningCosmWasmClient(networkId);
      if (!cosmWasmClient) {
        return null;
      }
      const client = new RakkiQueryClient(
        cosmWasmClient,
        rakkiFeature.contractAddress,
      );
      return await client.ticketsCountByUser({ userAddr: userAddress });
    },
    { staleTime: Infinity, refetchInterval: 10000 },
  );
  return { ticketsCount, ...other };
};
