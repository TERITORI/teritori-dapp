import { useQuery } from "@tanstack/react-query";

import { getNetwork } from "@/networks";
import { getMarketplaceClient } from "@/utils/backend";

export const useNews = (networkId: string) => {
  const { data } = useQuery(
    ["news", networkId],
    async () => {
      const backendClient = getMarketplaceClient(networkId);
      if (!backendClient) {
        return [];
      }
      const network = getNetwork(networkId);
      const { news } = await backendClient.News({ testnet: network?.testnet });
      return news;
    },
    {
      staleTime: Infinity,
    },
  );
  return data;
};
