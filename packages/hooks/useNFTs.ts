import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

import { NFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import { parseNetworkObjectId } from "../networks";
import { getMarketplaceClient } from "../utils/backend";
import { addNftListMetadata } from "../utils/ethereum";

export const useNFTs = (req: NFTsRequest) => {
  const baseOffset = useRef(req.offset);

  const { data, fetchNextPage } = useInfiniteQuery(
    ["nfts", { ...req, offset: baseOffset.current }],
    async ({ pageParam = 0 }) => {
      let nfts: NFT[] = [];

      const objectId = req.ownerId || req.collectionId;
      const [network] = parseNetworkObjectId(objectId);

      const marketplaceClient = getMarketplaceClient(network?.id);
      if (!marketplaceClient) {
        return { nextCursor: pageParam + req.limit, nfts };
      }

      const pageReq = {
        ...req,
        offset: baseOffset.current + pageParam,
      };
      const stream = marketplaceClient.NFTs(pageReq);
      await stream.forEach((response) => {
        if (!response.nft) {
          return;
        }
        nfts.push(response.nft);
      });

      nfts = await addNftListMetadata(nfts);

      return { nextCursor: pageParam + req.limit, nfts };
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const nfts = useMemo(() => {
    if (!data?.pages) {
      return [];
    }
    const flat = [];
    for (const page of data.pages) {
      flat.push(...page.nfts);
    }
    return flat;
  }, [data?.pages]);

  return { nfts, fetchMore: fetchNextPage };
};
