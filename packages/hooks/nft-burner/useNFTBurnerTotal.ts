import { useQuery } from "@tanstack/react-query";

import { NftsBurnerQueryClient } from "@/contracts-clients/nfts-burner";
import {
  NetworkFeature,
  getNetwork,
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
} from "@/networks";

export const nftBurnerTotalQueryKey = (networkId: string | undefined) => [
  "nft-burner-total",
  networkId,
];

export const useNFTBurnerTotal = (networkId: string | undefined) => {
  return useQuery(
    nftBurnerTotalQueryKey(networkId),
    async () => {
      if (!networkId) {
        return null;
      }

      const network = getNetwork(networkId);
      if (!network) {
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

      const res = await burnerClient.burnedTotal();
      return res;
    },
    { staleTime: Infinity },
  );
};
