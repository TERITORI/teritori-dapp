import { useEffect, useState } from "react";

import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { Metadata } from "../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

// FIXME: use react-query to prevent recalling the api all the time

export const useTNSMetadata = (address?: string) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<Metadata>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const effect = async () => {
      setLoading(true);

      try {
        if (!address) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const contractAddress =
          process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS || "";
        // We just want to read, so we use a non-signing client
        const cosmWasmClient = await getNonSigningCosmWasmClient();

        const tnsClient = new TeritoriNameServiceQueryClient(
          cosmWasmClient,
          contractAddress
        );

        const aliasResponse = await cosmWasmClient.queryContractSmart(
          contractAddress,
          {
            primary_alias: {
              address,
            },
          }
        );

        // ======== Getting NFT info
        const nftInfo = await tnsClient.nftInfo({
          tokenId: aliasResponse.username,
        });

        setMetadata(nftInfo.extension);
      } catch (err) {
        console.warn(err);
        setNotFound(true);
      }
      setLoading(false);
    };

    effect();
  }, [address]);

  return { loading, metadata, notFound };
};
