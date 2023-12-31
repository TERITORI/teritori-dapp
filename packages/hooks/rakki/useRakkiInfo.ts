import { useQuery } from "@tanstack/react-query";

import { RakkiQueryClient } from "../../contracts-clients/rakki/Rakki.client";
import {
  NetworkFeature,
  getNetwork,
  getNonSigningCosmWasmClient,
} from "../../networks";

export const useRakkiInfo = (networkId: string) => {
  const { data: rakkiInfo, ...other } = useQuery(
    ["rakkiInfo", networkId],
    async () => {
      const network = getNetwork(networkId);
      if (!network) {
        return null;
      }
      const rakkiFeature = network.featureObjects?.find(
        (fo) => fo.kind === NetworkFeature.CosmWasmRakki,
      );
      if (rakkiFeature?.kind !== NetworkFeature.CosmWasmRakki) {
        // TODO: find a better way to get feature typing
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
