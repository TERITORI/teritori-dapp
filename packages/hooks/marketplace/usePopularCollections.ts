import { useQuery } from "@tanstack/react-query";

import { PopularCollection } from "@/api/marketplace/v1/marketplace";
import { getMarketplaceClient } from "@/utils/backend";

export const popularCollectionsQueryKey = (
  networkId: string | undefined,
  periodHours?: number,
) => {
  const base: unknown[] = ["popular-collections", networkId];
  if (periodHours) {
    base.push(periodHours);
  }
  return base;
};

export const usePopularCollections = (
  networkId: string | undefined,
  periodHours: number,
) => {
  return useQuery(
    popularCollectionsQueryKey(networkId, periodHours),
    async () => {
      const client = getMarketplaceClient(networkId);
      if (!client) {
        return [];
      }
      const collections: PopularCollection[] = [];
      await client
        .PopularCollections({ networkId, periodHours, limit: 100 })
        .forEach(({ collection }) => {
          if (!collection) {
            return;
          }
          collections.push(collection);
        });
      return collections;
    },
  );
};
