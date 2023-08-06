import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Post } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import {
  GNO_SOCIAL_FEEDS_PKG_PATH,
  TERITORI_FEED_ID,
} from "../../components/socialFeed/const";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { GnoNetworkInfo, NetworkKind } from "../../networks";
import { extractGnoString } from "../../utils/gno";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

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

const fetchTeritoriComments = async (
  networkId: string,
  pageParam: number,
  parentId?: string
) => {
  const client = await nonSigningSocialFeedClient({
    networkId,
  });

  const subComment = await client.querySubPosts({
    count: 5,
    from: pageParam || 0,
    sort: "desc",
    identifier: parentId || "",
  });

  return { list: subComment };
};

const fetchGnoComments = async (
  selectedNetwork: GnoNetworkInfo,
  parentId: string
) => {
  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
  const output = await provider.evaluateExpression(
    GNO_SOCIAL_FEEDS_PKG_PATH,
    `GetComments(${TERITORI_FEED_ID}, ${parentId})`
  );

  const posts: Post[] = [];

  const outputStr = extractGnoString(output);
  for (const postData of outputStr.split(",")) {
    const post = decodeGnoPost(selectedNetwork.id, postData);
    posts.push(post);
  }
  return { list: posts.sort((p1, p2) => p2.createdAt - p1.createdAt) };
};

export const useFetchComments = ({
  parentId,
  totalCount,
  enabled,
}: ConfigType) => {
  // variable
  const selectedNetwork = useSelectedNetworkInfo();

  // request
  const data = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", parentId, selectedNetwork?.id],
    async ({ pageParam }) => {
      if (selectedNetwork?.kind === NetworkKind.Gno) {
        return await fetchGnoComments(selectedNetwork, parentId || "");
      } else {
        return await fetchTeritoriComments(
          selectedNetwork?.id || "",
          pageParam,
          parentId
        );
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

  return data;
};
