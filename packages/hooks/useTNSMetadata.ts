import { useQuery } from "@tanstack/react-query";

import { useTNSMetaDataList } from "../context/TNSMetaDataListProvider";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { PrimaryAliasResponse } from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { getNonSigningCosmWasmClient } from "../utils/keplr";
import { Network } from "../utils/network";
import { useSelectedNetworkInfo } from "./useSelectedNetwork";

// FIXME: use react-query to prevent recalling the api all the time

export const useTNSMetadata = (address?: string) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();

  const { metaDataList, addMetaData } = useTNSMetaDataList();

  const { data, isLoading, isError } = useQuery(
    ["tns-metadata", address, selectedNetworkInfo?.network],
    async () => {
      if (!address || !selectedNetworkInfo?.network) {
        return null;
      }
      const storedMetadata = metaDataList[address];
      if (storedMetadata) return storedMetadata;

      try {
        let aliasResponse: PrimaryAliasResponse = { username: address };

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

        if (!address.includes(".tori")) {
          aliasResponse = await tnsClient.primaryAlias({
            address,
          });
        }

        // ======== Getting NFT info
        const nftInfo = await tnsClient.nftInfo({
          tokenId: aliasResponse.username,
        });

        addMetaData(address, {
          tokenId: aliasResponse.username,
          ...nftInfo.extension,
        });

        return { tokenId: aliasResponse.username, ...nftInfo.extension };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        return null;
      }
    },
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  return { loading: isLoading, metadata: data, notFound: isError };
};
