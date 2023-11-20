import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useRef, useMemo, useCallback } from "react";

import { addCollectionMetadata } from "./../utils/ethereum";
import {
  Collection,
  CollectionsRequest,
} from "../api/marketplace/v1/marketplace";
import { getNetwork, NetworkKind } from "../networks";
import { getMarketplaceClient } from "../utils/backend";

export const useCollections = (
  req: CollectionsRequest,
  filter?: (c: Collection) => boolean,
): {
  fetchNextPage: (options?: FetchNextPageOptions) => Promise<
    InfiniteQueryObserverResult<
      | {
          nextCursor: number;
          collections: Collection[];
        }
      | { nextCursor: number; collections: Collection[] },
      unknown
    >
  >;
  fetchMore: (index: number) => Promise<void>;
  collections: Collection[];
} => {
  const baseOffset = useRef(req.offset);

  const { data, fetchNextPage } = useInfiniteQuery(
    ["collections", { ...req, baseOffset }],
    async ({ pageParam = 0 }) => {
      let collections: Collection[] = [];

      const marketplaceClient = getMarketplaceClient(req.networkId);
      if (!marketplaceClient) {
        return { nextCursor: pageParam + req.limit, collections };
      }

      const pageReq = {
        ...req,
        offset: baseOffset.current + pageParam,
      };

      const stream = marketplaceClient.Collections(pageReq);

      await stream.forEach(({ collection }) => {
        collection && collections.push(collection);
      });

      // FIXME: refactor into addCollectionListMetadata

      collections = await Promise.all(
        collections.map(async (c) => {
          const network = getNetwork(c.networkId);
          if (network?.kind === NetworkKind.Ethereum) {
            return addCollectionMetadata(c);
          }
          return c;
        }),
      );

      return { nextCursor: pageParam + req.limit, collections };
    },
    {
      staleTime: Infinity,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const collections = useMemo(() => {
    const pages = data?.pages || [];
    return pages.reduce(
      (acc: Collection[], page) => [...acc, ...page.collections],
      [],
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
    [fetchNextPage],
  );

  return {
    collections: filteredCollections,
    fetchNextPage,
    fetchMore,
  };
};
