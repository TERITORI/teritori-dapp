import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

import { NFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";
import { addNftMetadatas } from "../utils/ethereum";
import { Network } from "../utils/network";
import { useSelectedNetwork } from "./useSelectedNetwork";

export const useNFTs = (req: NFTsRequest) => {
  const baseOffset = useRef(req.offset);
  const selectedNetwork = useSelectedNetwork();

  const { data, fetchNextPage } = useInfiniteQuery(
    [
      "nfts",
      req.collectionId,
      req.ownerId,
      req.sort,
      req.sortDirection,
      baseOffset.current,
    ],
    async ({ pageParam = 0 }) => {
      let nfts: NFT[] = [];
      const pageReq = {
        ...req,
        offset: baseOffset.current + pageParam,
      };
      const stream = backendClient.NFTs(pageReq);
      await stream.forEach((response) => {
        if (!response.nft) {
          return;
        }
        nfts.push(response.nft);
      });

      if (selectedNetwork === Network.Ethereum) {
        nfts = await addNftMetadatas(nfts);
      }

      return { nextCursor: pageParam + req.limit, nfts };
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
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
