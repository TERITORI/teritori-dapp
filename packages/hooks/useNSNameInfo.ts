import { useQuery } from "@tanstack/react-query";

import { getCosmosNameServiceQueryClient } from "../utils/contracts";

export const nsNameInfoQueryKey = (
  networkId: string | undefined,
  tokenId: string | null | undefined
) => ["nsNameInfo", networkId, tokenId];

export const useNSNameInfo = (
  networkId: string | undefined,
  tokenId: string | null | undefined,
  enabled?: boolean
) => {
  const { data: nsInfo, ...other } = useQuery(
    nsNameInfoQueryKey(networkId, tokenId),
    async () => {
      if (!tokenId) {
        return null;
      }

      const nsClient = await getCosmosNameServiceQueryClient(networkId);
      if (!nsClient) {
        return null;
      }

      let nftInfo;

      try {
        nftInfo = await nsClient.nftInfo({
          tokenId,
        });
      } catch (err) {
        if (err instanceof Error && err.message.includes("not found")) {
          return null;
        }
        throw err;
      }

      return nftInfo;
    },
    { staleTime: Infinity, enabled }
  );
  return { nsInfo, notFound: nsInfo === null, ...other };
};
