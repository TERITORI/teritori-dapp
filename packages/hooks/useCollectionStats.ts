import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";

import { useCoingeckoPrices } from "./useCoingeckoPrices";
import {
  parseNetworkObjectId,
  WEI_TOKEN_ADDRESS,
  NetworkKind,
} from "../networks";
import { getMarketplaceClient } from "../utils/backend";

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const [network] = parseNetworkObjectId(collectionId);

  const networkId = network?.id;

  const coins =
    network?.kind === NetworkKind.Ethereum
      ? [{ networkId, denom: WEI_TOKEN_ADDRESS }]
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

  const usdPrice = prices["ethereum"]?.["usd"] || 0;

  const adjustedData = useMemo(() => {
    if (!data || network?.kind !== NetworkKind.Ethereum) return data;

    // FIXME: fix from backend to not send nil
    const ether = ethers.utils.formatEther(
      BigNumber.from(data.totalVolume !== "<nil>" ? data.totalVolume || 0 : 0),
    );
    return {
      ...data,
      totalVolume: `${+ether * usdPrice}`,
    };
  }, [data, network?.kind, usdPrice]);

  return adjustedData;
};
