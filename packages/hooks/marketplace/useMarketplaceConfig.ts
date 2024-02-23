import { useQuery } from "@tanstack/react-query";

import { NftMarketplaceQueryClient } from "@/contracts-clients/nft-marketplace/NftMarketplace.client";
import { getCosmosNetwork, mustGetNonSigningCosmWasmClient } from "@/networks";

export const useMarketplaceConfig = (networkId: string | undefined) => {
  const { data: marketplaceConfig, ...other } = useQuery(
    ["marketplace-config", networkId],
    async () => {
      if (!networkId) {
        return null;
      }
      const network = getCosmosNetwork(networkId);
      if (!network?.vaultContractAddress) {
        return null;
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new NftMarketplaceQueryClient(
        cosmwasmClient,
        network.vaultContractAddress,
      );
      return await client.config();
    },
    { staleTime: Infinity },
  );
  return { marketplaceConfig, ...other };
};
