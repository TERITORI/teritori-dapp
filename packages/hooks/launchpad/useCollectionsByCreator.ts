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
    const results: CollectionDataResult[] = [];

    try {
      const client = mustGetLaunchpadClient(networkId);

      if (!client || !creatorId) {
        return [];
      }
      const { collections: collectionsData } =
        await client.CollectionsByCreator(req);

      collectionsData.forEach((collectionData) => {
        if (!collectionData) {
          return;
        }
        const result: CollectionDataResult | undefined = zodTryParseJSON(
          ZodCollectionDataResult,
          collectionData,
        );
        if (!result) return;
        results.push(result);
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
    return results;
  });
};
