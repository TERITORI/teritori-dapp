import { useQuery } from "@tanstack/react-query";

import { CollectionsByCreatorRequest } from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

export const useCollectionsByCreator = (req: CollectionsByCreatorRequest) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  const creatorId = req.creatorId;

  return useQuery(["collectionsByCreator", networkId, creatorId], async () => {
    const collectionsData: CollectionDataResult[] = [];

    try {
      const client = mustGetLaunchpadClient(networkId);

      if (!client || !creatorId) {
        return [];
      }
      const { collections } = await client.CollectionsByCreator(req);

      collections.forEach((data) => {
        if (!data) {
          return;
        }
        const collectionData: CollectionDataResult | undefined =
          zodTryParseJSON(ZodCollectionDataResult, data);
        if (!collectionData) return;
        collectionsData.push(collectionData);
      });
    } catch (e: any) {
      console.error("Error getting collections by creator: ", e);
      setToast({
        mode: "normal",
        type: "error",
        title: "Error getting collections by creator",
        message: e.message,
      });
    }
    return collectionsData;
  });
};
