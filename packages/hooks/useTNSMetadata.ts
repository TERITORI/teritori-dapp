import { useEffect, useState } from "react";

import { useFeedbacks } from "../context/FeedbacksProvider";
import { TeritoriNameServiceQueryClient } from "../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { getNonSigningCosmWasmClient } from "../utils/keplr";

export const useTNSMetadata = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<any>(); // FIXME: type this
  const [notFound, setNotFound] = useState(false);
  const { setToastError } = useFeedbacks();

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);

      const contractAddress = process.env
        .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
      // We just want to read, so we use a non-signing client
      const cosmWasmClient = await getNonSigningCosmWasmClient();

      const tnsClient = new TeritoriNameServiceQueryClient(
        cosmWasmClient,
        contractAddress
      );

      try {
        const aliasResponse = await cosmWasmClient.queryContractSmart(
          contractAddress,
          {
            primary_alias: {
              address: id.replace("tori-", ""),
            },
          }
        );

        // ======== Getting NFT info
        const nftInfo = await tnsClient.nftInfo({
          tokenId: aliasResponse.username,
        });
        // ======== Getting NFT owner
        const { owner } = await tnsClient.ownerOf({
          tokenId: aliasResponse.username,
        });
        nftInfo.extension.userId = owner;
        setNotFound(false);
        return nftInfo.extension;
      } catch {
        setNotFound(true);
        return undefined;
      }
    };

    getToken()
      .then((metadata) => {
        if (metadata) setMetadata(metadata);
        setLoading(false);
      })
      .catch((e) => {
        console.warn("ERROR getToken() : ", e);
        setLoading(false);
        setToastError({
          title: "Something went wrong!",
          message: e.message,
        });
      });
  }, [id]);

  return { loading, metadata, notFound };
};
