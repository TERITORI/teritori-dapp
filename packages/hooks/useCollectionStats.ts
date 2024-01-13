import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import { parseNetworkObjectId, NetworkKind } from "../networks";
import { getMarketplaceClient } from "../utils/backend";

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const [network] = parseNetworkObjectId(collectionId);

  const networkId = network?.id;

  const coins =
    network?.kind === NetworkKind.Ethereum
      ? [{ networkId, denom: network.currencies[0].denom }]
      : [];

  const { prices } = useCoingeckoPrices(coins);

  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId],
    async () => {
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
