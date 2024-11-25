import { useQuery } from "@tanstack/react-query";

import { NftsBurnerQueryClient } from "@/contracts-clients/nfts-burner";
import {
  NetworkFeature,
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
  parseUserId,
} from "@/networks";

export const nftBurnerUserCountQueryKey = (userId: string | undefined) => [
  "nft-burner-user-count",
  userId,
];

export const useNFTBurnerUserCount = (userId: string | undefined) => {
  return useQuery(
    nftBurnerUserCountQueryKey(userId),
    async () => {
      if (!userId) {
        return null;
      }

      const [network, userAddress] = parseUserId(userId);
      if (!network || !userAddress) {
        return null;
      }

      const feature = getNetworkFeature(
        network.id,
        NetworkFeature.CosmWasmNFTsBurner,
      );
      if (!feature) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(network.id);
      const burnerClient = new NftsBurnerQueryClient(
        client,
        feature.burnerContractAddress,
      );

      const res = await burnerClient.burnedByUser({
        userAddr: userAddress,
      });
      return res;
    },
    { staleTime: Infinity },
  );
};
