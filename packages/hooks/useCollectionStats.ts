import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { parseNetworkObjectId, NetworkKind } from "@/networks";
import { getMarketplaceClient } from "@/utils/backend";

export const collectionStatsQueryKey = (
  collectionId: string,
  ownerId?: string,
) => {
  const qk = ["collectionStats", collectionId];
  if (ownerId) {
    qk.push(ownerId);
  }
  return qk;
};

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const [network] = parseNetworkObjectId(collectionId);

  const networkId = network?.id;

  const { data } = useQuery(
    collectionStatsQueryKey(collectionId, ownerId),
    async ({ queryKey }) => {
      const marketplaceClient = getMarketplaceClient(networkId);
      if (!marketplaceClient) {
        return null;
      }

      const req = {
        collectionId,
        ownerId,
      };

      const { stats } = await marketplaceClient.CollectionStats(req);
      return stats;
    },
    { staleTime: Infinity, keepPreviousData: true },
  );

  const adjustedData = useMemo(() => {
    if (!data || network?.kind !== NetworkKind.Ethereum) return data;

    return {
      ...data,
      // FIXME: fix from backend to not send nil
      totalVolume: data.totalVolume !== "<nil>" ? data.totalVolume || "0" : "0",
    };
  }, [data, network?.kind]);
  return adjustedData;
};
