import { useQuery } from "@tanstack/react-query";

import { NftsBurnerQueryClient } from "@/contracts-clients/nfts-burner";
import {
  NetworkFeature,
  getNetwork,
  getNetworkFeature,
  mustGetNonSigningCosmWasmClient,
} from "@/networks";

export const useNFTBurnerAuthorizedCollections = (
  networkId: string | undefined,
) => {
  return useQuery(
    ["nft-burner-authorized-collections", networkId],
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

      const res = await burnerClient.authorizedCollections({
        limit: 50,
        offset: 0,
      });
      return res;
    },
    {
      staleTime: Infinity,
    },
  );
};
