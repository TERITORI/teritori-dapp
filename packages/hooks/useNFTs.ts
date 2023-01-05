import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

import { NFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import { getNetwork } from "../networks";
import { backendClient } from "../utils/backend";
import { addNftMetadatas } from "../utils/ethereum";
import { Network } from "../utils/network";

export const useNFTs = (req: NFTsRequest) => {
  const baseOffset = useRef(req.offset);

  const { data, fetchNextPage } = useInfiniteQuery(
    [
      "nfts",
      req.collectionId,
      req.ownerId,
      req.sort,
      req.sortDirection,
      baseOffset.current,
      req.networkId,
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

      const networkInfo = getNetwork(req.networkId);
      if (networkInfo?.network === Network.Ethereum) {
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
