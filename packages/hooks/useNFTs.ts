import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";

import { NFTsRequest, NFT } from "../api/marketplace/v1/marketplace";
import {useBackendClient} from "./useBackendClient";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";

export const useNFTs = (req: NFTsRequest) => {
  const baseOffset = useRef(req.offset);
  const {backendClient, isForceBackendMainnet} = useBackendClient()

  const { data, fetchNextPage } = useInfiniteQuery(
    [
      "nfts",
      req.collectionId,
      req.ownerId,
      req.sort,
      req.sortDirection,
      baseOffset.current,
      isForceBackendMainnet()
    ],
    async ({ pageParam = 0 }) => {
      const nfts: NFT[] = [];
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
