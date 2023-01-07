import { useQuery } from "@tanstack/react-query";

import { parseUserId } from "../networks";
import { getCosmosNameServiceQueryClient } from "../utils/contracts";

export const nsPrimaryAliasQueryKey = (userId: string | undefined) => [
  "nsPrimaryAlias",
  userId,
];

export const useNSPrimaryAlias = (userId: string | undefined) => {
  const { data, ...other } = useQuery(
    nsPrimaryAliasQueryKey(userId),
    async () => {
      if (!userId) {
        return null;
      }

      const [network, userAddress] = parseUserId(userId);
      const nsClient = await getCosmosNameServiceQueryClient(network?.id);
      if (!nsClient || !userAddress) {
        return null;
      }

      let response;

      try {
        response = await nsClient.primaryAlias({ address: userAddress });
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("Primary alias not found not found")
        ) {
          return null;
        }
        throw err;
      }

      return response.username;
    },
    { staleTime: Infinity }
  );
  return { primaryAlias: data, ...other };
};
