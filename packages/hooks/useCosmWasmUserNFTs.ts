import { useQuery } from "@tanstack/react-query";

import { TeritoriNftQueryClient } from "../contracts-clients/teritori-nft/TeritoriNft.client";
import { mustGetNonSigningCosmWasmClient } from "../networks";

// TODO: pagination
export const useCosmWasmUserNFTs = (
  networkId: string | undefined,
  nftContractAddress: string | undefined,
  ownerAddress: string | undefined
) => {
  const { data, ...other } = useQuery(
    ["onchainNFTs", networkId, nftContractAddress, ownerAddress],
    async () => {
      if (!networkId || !nftContractAddress || !ownerAddress) {
        return [];
      }
      const cosmwasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const nftClient = new TeritoriNftQueryClient(
        cosmwasmClient,
        nftContractAddress
      );
      const res = await nftClient.tokens({ owner: ownerAddress, limit: 100 });
      return res.tokens;
    }
  );
  return { tokenIds: data, ...other };
};
