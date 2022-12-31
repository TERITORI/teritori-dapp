import { useQuery } from "@tanstack/react-query";
import { useSelectedNetworkId } from "./useSelectedNetwork";
import { backendClient } from "../utils/backend";

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const networkId = useSelectedNetworkId();
  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId],
    async () => {
      const { stats } = await backendClient.CollectionStats({
        collectionId,
        ownerId,
        networkId,
      });
      return stats;
    }
  );
  return data;
};
