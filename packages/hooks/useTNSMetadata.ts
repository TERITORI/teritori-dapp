import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getNetwork } from "../networks";
import { selectSelectedNetworkId } from "../store/slices/settings";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

// FIXME: use react-query to prevent recalling the api all the time

export const useTNSMetadata = (address?: string) => {
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);

  const { data, isLoading, isError } = useQuery(
    ["tns-metadata", address, selectedNetworkId],
    async () => {
      if (!address) {
        return null;
      }

      const contractAddress =
        process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS || "";
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient(selectedNetwork);

      const tnsClient = new TeritoriNameServiceQueryClient(
        cosmWasmClient,
        contractAddress
      );

      const aliasResponse = await tnsClient.primaryAlias({
        address,
      });

      // ======== Getting NFT info
      const nftInfo = await tnsClient.nftInfo({
        tokenId: aliasResponse.username,
      });

      return { tokenId: aliasResponse.username, ...nftInfo.extension };
    },
    { staleTime: Infinity }
  );

  return { loading: isLoading, metadata: data, notFound: isError };
};
