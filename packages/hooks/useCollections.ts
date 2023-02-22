import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useMemo, useCallback } from "react";

import {
  Collection,
  CollectionsRequest,
} from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";
import { Network } from "../utils/network";
import { addCollectionMetadatas } from "./../utils/ethereum";
import { useSelectedNetwork } from "./useSelectedNetwork";

export const useCollections = (
  req: CollectionsRequest,
  filter?: (c: Collection) => boolean
): [Collection[], (index: number) => Promise<void>] => {
  const baseOffset = useRef(req.offset);
  const selectedNetwork = useSelectedNetwork();

  const { data, fetchNextPage } = useInfiniteQuery(
    [
      "collections",
      req.networkId,
      req.mintState,
      req.sort,
      req.sortDirection,
      req.upcoming,
    ],
    async ({ pageParam = 0 }) => {
      let collections: Collection[] = [];
      const pageReq = {
        ...req,
        offset: baseOffset.current + pageParam,
      };

      const stream = backendClient.Collections(pageReq);

      await stream.forEach(({ collection }) => {
        collection && collections.push(collection);
      });

      if (selectedNetwork === Network.Ethereum) {
        // TODO: Hack for adding metadata for ethereum collections, should use an indexed data
        collections = await addCollectionMetadatas(collections);
      }

      return { nextCursor: pageParam + req.limit, collections };
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const collections = useMemo(() => {
    const pages = data?.pages || [];
    return pages.reduce(
      (acc: Collection[], page) => [...acc, ...page.collections],
      []
    );
  }, [data?.pages]);

  const filteredCollections = useMemo(() => {
    if (!filter) {
      return collections;
    }
    return collections.filter(filter);
  }, [collections, filter]);

  const fetchMore = useCallback(
    async (index: number) => {
      await fetchNextPage({ pageParam: index });
    },
    [fetchNextPage]
  );

  return [filteredCollections, fetchMore];
};
