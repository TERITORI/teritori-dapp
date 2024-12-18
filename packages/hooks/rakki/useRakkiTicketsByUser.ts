import { useQuery } from "@tanstack/react-query";

import { RakkiQueryClient } from "../../contracts-clients/rakki/Rakki.client";
import {
  NetworkFeature,
  getNetworkFeature,
  getNonSigningCosmWasmClient,
  parseUserId,
} from "../../networks";

export const useRakkiTicketsCountByUser = (userId?: string) => {
  const { data: ticketsCount = null, ...other } = useQuery(
    ["rakkiTicketsCountByUser", userId],
    async () => {
      if (!userId) {
        return null;
      }
      const [network, userAddress] = parseUserId(userId);
      const networkId = network?.id;
      if (!networkId) {
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
