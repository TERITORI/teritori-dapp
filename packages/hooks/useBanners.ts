import { useQuery } from "@tanstack/react-query";

import { getNetwork } from "../networks";
import { mustGetMarketplaceClient } from "../utils/backend";

export const useBanners = (networkId: string) => {
  const { data } = useQuery(
    ["banners", networkId],
    async () => {
      const backendClient = mustGetMarketplaceClient(networkId);
      const network = getNetwork(networkId);
      const { banners } = await backendClient.Banners({
        testnet: network?.testnet,
      });
      return banners;
    },
    { staleTime: Infinity }
  );
  return data;
};
