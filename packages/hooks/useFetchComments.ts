import { useInfiniteQuery } from "@tanstack/react-query";

import { socialFeedClient } from "../client-creators/socialFeedClient";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "./useSelectedWallet";

export type FetchCommentResponse = {
  list: PostResult[];
} | null;

export const combineFetchCommentPages = (pages: FetchCommentResponse[]) =>
  pages.reduce(
    (acc: PostResult[], page) => [...acc, ...(page?.list || [])],
    []
  );

type ConfigType = {
  parentId?: string;
  totalCount?: number;
  enabled?: boolean;
};

export const useFetchComments = ({
  parentId,
  totalCount,
  enabled,
}: ConfigType) => {
  // variable
  const wallet = useSelectedWallet();

  // request
  const req = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", wallet?.address, parentId],
    async ({ pageParam }) => {
      if (!wallet?.address) {
        return null;
      }

      try {
        const client = await socialFeedClient({
          walletAddress: wallet.address,
        });

        const subComment = await client.querySubPosts({
          count: 5,
          from: pageParam || 0,
          sort: "desc",
          identifier: parentId || "",
        });

        return { list: subComment };
      } catch (err) {
        console.log("initData err", err);
        return null;
      }
    },
    {
      getNextPageParam: (_, pages) => {
        const postsLength = combineFetchCommentPages(pages).length;

        if ((totalCount || 0) > postsLength) {
          return postsLength;
        }
        return null;
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: !!(enabled && parentId),
    }
  );

  return req;
};
