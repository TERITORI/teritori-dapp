import { useQuery } from "@tanstack/react-query";

import { backendClient } from "../utils/backend";

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId],
    async () => {
      const { stats } = await backendClient.CollectionStats({
        collectionId,
        ownerId,
      });
      return stats;
    }
  );
  return data;
};
