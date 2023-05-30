import { useQuery } from "@tanstack/react-query";

import { getCosmosNameServiceQueryClient } from "../../utils/contracts";

export const useNSNameOwner = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
  enabled?: boolean
) => {
  const { data, ...other } = useQuery(
    ["nsNameOwner", networkId, tokenId],
    async () => {
      if (!tokenId) {
        return null;
      }

      const nsClient = await getCosmosNameServiceQueryClient(networkId);
      if (!nsClient) {
        return null;
      }

      let ownerInfo;

      try {
        ownerInfo = await nsClient.ownerOf({
          tokenId,
        });
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          return null;
        }
        throw err;
      }

      return ownerInfo.owner;
    },
    { staleTime: Infinity, enabled }
  );
  return { nameOwner: data, notFound: data === null, ...other };
};
