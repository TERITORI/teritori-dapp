import { useInfiniteQuery } from "@tanstack/react-query";

import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useSelectedNetworkId } from "../useSelectedNetwork";

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
  const selectedNetworkId = useSelectedNetworkId();

  // request
  const data = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", parentId],
    async ({ pageParam }) => {
      const client = await nonSigningSocialFeedClient({
        networkId: selectedNetworkId,
      });

      const subComment = await client.querySubPosts({
        count: 5,
        from: pageParam || 0,
        sort: "desc",
        identifier: parentId || "",
      });

      return { list: subComment };
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

  return data;
};
