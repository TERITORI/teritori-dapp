import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import useSelectedWallet from "../useSelectedWallet";

import { Post } from "@/api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "@/client-creators/socialFeedClient";
import { PostResult } from "@/contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { GnoNetworkInfo, NetworkKind, parseNetworkObjectId } from "@/networks";
import { postViewToPost, postViewsFromJson } from "@/utils/feed/gno";
import { extractGnoJSONResponse } from "@/utils/gno";
import { postResultToPost } from "@/utils/social-feed";

export type FetchCommentResponse = {
  list: Post[];
} | null;

const combineFetchCommentPages = (pages: FetchCommentResponse[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

type ConfigType = {
  parentId?: string;
  totalCount?: number;
  enabled?: boolean;
};

const fetchTeritoriComments = async (
  networkId: string,
  pageParam: number,
  parentId?: string,
) => {
  const client = await nonSigningSocialFeedClient({
    networkId,
  });

  const comments = await client.querySubPosts({
    count: 5,
    from: pageParam || 0,
    sort: "desc",
    identifier: parentId || "",
  });

  return {
    list: comments.map((subPostRes: PostResult) =>
      postResultToPost(networkId, subPostRes),
    ),
    totalCount: comments.length,
  };
};

const gnoCommentsLimit = 10;
const fetchGnoComments = async (
  selectedNetwork: GnoNetworkInfo,
  parentId: string,
  callerAddress: string | undefined,
  pageParam: number,
): Promise<FetchCommentResponse> => {
  if (!selectedNetwork.socialFeedsPkgPath) return { list: [] };
  callerAddress = callerAddress || "";

  const limit = gnoCommentsLimit;
  const offset = pageParam * limit;
  const tags = "";
  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);

  const output = await provider.evaluateExpression(
    selectedNetwork.socialFeedsPkgPath || "",
    `postViewsToJSON(GetChildrenPosts("${parentId}", ${offset}, ${limit}, "${tags}", "${callerAddress}"))`,
  );
  const raw = extractGnoJSONResponse(output);
  const postViews = postViewsFromJson(raw);
  return {
    list: postViews.map((postView) =>
      postViewToPost(postView, selectedNetwork.id),
    ),
  };
};

const useFetchCommentsRaw = ({ parentId, totalCount, enabled }: ConfigType) => {
  const selectedWallet = useSelectedWallet();
  const [parentNetwork, localIdentifier] = parseNetworkObjectId(parentId);

  const data = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", parentId],
    async ({ pageParam = 0 }) => {
      let comments: FetchCommentResponse;
      if (parentNetwork?.kind === NetworkKind.Gno) {
        comments = await fetchGnoComments(
          parentNetwork,
          localIdentifier,
          selectedWallet?.address,
          pageParam,
        );
      }
      // Other networks (e.g., Cosmos)
      else {
        comments = await fetchTeritoriComments(
          parentNetwork?.id || "",
          pageParam,
          localIdentifier,
        );
      }
      return comments;
    },
    {
      getNextPageParam: (_, pages) => {
        if (parentNetwork?.kind === NetworkKind.Gno) {
          if ((totalCount || 0) >= gnoCommentsLimit) {
            return pages.length;
          }
        } else {
          const postsLength = combineFetchCommentPages(pages).length;

          if ((totalCount || 0) > postsLength) {
            return postsLength;
          }
          return null;
        }
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      enabled: (enabled ?? true) && !!parentId,
    },
  );

  return data;
};

export const useFetchComments = (config: ConfigType) => {
  const { data: rawData, ...other } = useFetchCommentsRaw(config);

  const data = useMemo(() => {
    const [network] = parseNetworkObjectId(config.parentId);
    const networkId = network?.id;
    if (!rawData || !networkId) {
      return [];
    }
    return combineFetchCommentPages(rawData.pages);
  }, [rawData, config.parentId]);

  return { data, ...other };
};
