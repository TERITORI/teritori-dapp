import { useQuery } from "@tanstack/react-query";

import { mustGetMarketplaceClient } from "../../utils/backend";

export const useOwnersByCollection = (
  collectionId: string,
  networkId?: string
) => {
  const { data: owners = [] } = useQuery(
    ["OwnersByCollection", networkId, collectionId],
    async () => {
      if (!networkId) {
        return [];
      }
      return await getOwnersByCollection(collectionId, networkId);
    },
    {
      staleTime: Infinity,
    }
  );
  return { owners };
};

export const getOwnersByCollection = async (
  collectionId: string,
  networkId: string
) => {
  const client = mustGetMarketplaceClient(networkId);
  if (!client) {
    return [];
  }
  const reply = await client.OwnersByCollection({
    collectionId,
  });
  return reply.owners;
};
