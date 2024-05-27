import { useQuery } from "@tanstack/react-query";

import { mustGetLaunchpadClient } from "@/utils/backend";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

export const useCollectionsByCreator = (
  networkId: string | undefined,
  userId: string | undefined,
) => {
  return useQuery(["collectionsByCreator", networkId, userId], async () => {
    const collectionsData: CollectionDataResult[] = [];

    try {
      const client = mustGetLaunchpadClient(networkId);

      if (!client || !userId) {
        return [];
      }
      const { collections } = await client.CollectionsByCreator({
        creatorId: userId,
      });

      collections.forEach((data) => {
        if (!data) {
          return;
        }
        const collectionData: CollectionDataResult | undefined =
          zodTryParseJSON(ZodCollectionDataResult, data);
        if (!collectionData) return;
        collectionsData.push(collectionData);
      });
    } catch (e) {
      console.error("Error getting collections by creator:", e);
    }
    return collectionsData;
  });
};
