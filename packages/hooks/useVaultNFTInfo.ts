import { useQuery } from "@tanstack/react-query";

import { NftMarketplaceQueryClient } from "@/contracts-clients/nft-marketplace/NftMarketplace.client";
import {
  getCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
} from "@/networks";

export const useVaultNFTInfo = (nftId: string | undefined) => {
  const { data, ...other } = useQuery(
    ["vaultNFTInfo", nftId],
    async () => {
      console.log("getting nft info of ", nftId);

      const [nftNetwork, nftContractAddress, tokenId] = parseNftId(nftId);
      if (!nftNetwork || !nftContractAddress || !tokenId) {
        return null;
      }

      console.log("parsed nft info", nftNetwork, nftContractAddress, tokenId);

      const network = getCosmosNetwork(nftNetwork.id);
      if (!network?.vaultContractAddress) {
        return null;
      }

      const client = await mustGetNonSigningCosmWasmClient(network.id);
      const vaultClient = new NftMarketplaceQueryClient(
        client,
        network?.vaultContractAddress,
      );
      return await vaultClient.nftInfo({
        nftContractAddr: nftContractAddress,
        nftTokenId: tokenId,
      });
    },
    { staleTime: Infinity },
  );

  return { vaultNFTInfo: data, ...other };
};
