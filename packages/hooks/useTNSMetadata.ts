import { useQuery } from "@tanstack/react-query";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

// FIXME: use react-query to prevent recalling the api all the time

export const useTNSMetadata = (address?: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const { data, isLoading, isError } = useQuery(
    ["tns-metadata", address, selectedNetworkInfo?.network],
    async () => {
      if (!address || !selectedNetworkInfo?.network) {
        return null;
      }

      // TODO: Do not support NS for Ethereum for now
      if (selectedNetworkInfo.network === Network.Ethereum) {
        return null;
      }

      // NOTE: sometime, network changed before collections changed
      // so we have to check here one more time
      if (!address.startsWith("tori")) return null;

      const contractAddress =
        process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS || "";
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient();

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
