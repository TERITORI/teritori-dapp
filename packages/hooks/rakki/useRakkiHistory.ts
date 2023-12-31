import { useQuery } from "@tanstack/react-query";

import { RakkiQueryClient } from "../../contracts-clients/rakki/Rakki.client";
import {
  NetworkFeature,
  getNetwork,
  getNonSigningCosmWasmClient,
  getUserId,
} from "../../networks";

export const useRakkiHistory = (networkId: string) => {
  const { data: rakkiHistory, ...other } = useQuery(
    ["rakkiHistory", networkId],
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
      const history = await client.history({ limit: 42 });
      return history.map((h) => ({
        winnerUserId: getUserId(networkId, h[1]),
        date: new Date(h[0] * 1000),
      }));
    },
    { staleTime: Infinity, refetchInterval: 30000 },
  );
  return { rakkiHistory, ...other };
};
