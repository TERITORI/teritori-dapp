import { useQuery } from "@tanstack/react-query";

import { RakkiQueryClient } from "../../contracts-clients/rakki/Rakki.client";
import {
  NetworkFeature,
  getNetworkFeature,
  getNonSigningCosmWasmClient,
} from "../../networks";

export const useRakkiInfo = (networkId: string) => {
  const { data: rakkiInfo, ...other } = useQuery(
    ["rakkiInfo", networkId],
    async () => {
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
      const info = await client.info();
      return info;
    },
    { staleTime: Infinity, refetchInterval: 10000 },
  );
  return { rakkiInfo, ...other };
};
