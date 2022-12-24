import { useQuery } from "@tanstack/react-query";

import {useBackendClient} from "./useBackendClient";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";

export const useCollectionStats = (collectionId: string, ownerId?: string) => {
  const {backendClient, isForceBackendMainnet} = useBackendClient()

  const { data } = useQuery(
    ["collectionStats", collectionId, ownerId, isForceBackendMainnet()],
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
