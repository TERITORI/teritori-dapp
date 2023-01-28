import { useQuery } from "@tanstack/react-query";

import { backendClient } from "../utils/backend";

export const useBanners = (testnet: boolean) => {
  const { data } = useQuery(
    ["banners", testnet],
    async () => {
      const { banners } = await backendClient.Banners({ testnet });
      return banners;
    },
    { staleTime: Infinity }
  );
  return data;
};
