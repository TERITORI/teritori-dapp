import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import useSelectedWallet from "../useSelectedWallet";

import { Post, Reaction } from "@/api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "@/client-creators/socialFeedClient";
import { PostResult } from "@/contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { GnoNetworkInfo, NetworkKind, parseNetworkObjectId } from "@/networks";
import { gnoZenaoNetwork } from "@/networks/gno-zenao";
import { gnoZenaoStagingNetwork } from "@/networks/gno-zenao-staging";
import { TERITORI_FEED_ID } from "@/utils/feed/constants";
import { decodeGnoPost } from "@/utils/feed/gno";
import { extractGnoJSONResponse, extractGnoJSONString } from "@/utils/gno";
import { postResultToPost } from "@/utils/social-feed";
import { postViewToPost, postViewsFromJson } from "@/utils/zenao";

export type FetchCommentResponse = {
  list: Post[];
  totalCount: number | undefined;
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

const fetchGnoComments = async (
  selectedNetwork: GnoNetworkInfo,
  parentId: string,
): Promise<FetchCommentResponse> => {
  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);

  const offset = 0;
  const limit = 100; // For now hardcode to load max 100 comments

  const output = await provider.evaluateExpression(
    selectedNetwork.socialFeedsPkgPath || "",
    `GetComments(${TERITORI_FEED_ID}, ${parentId}, ${offset}, ${limit})`,
  );

  const comments: Post[] = [];

  const gnoPosts = extractGnoJSONString(output);
  for (const gnoPost of gnoPosts) {
    const post = decodeGnoPost(selectedNetwork.id, gnoPost);
    const chainReactions = post.reactions;
    const postReactions: Reaction[] = chainReactions.map((reaction) => ({
      icon: reaction.icon,
      count: reaction.count,
      ownState: false, // FIXME: find a way to get the user's reaction state from on-chain post
    }));

    comments.push({ ...post, reactions: postReactions });
  }

  return {
    list: comments.sort((p1, p2) => p2.createdAt - p1.createdAt),
    totalCount: comments.length,
  };
};

const gnoZenaoCommentsLimit = 10;
const fetchGnoZenaoComments = async (
  selectedNetwork: GnoNetworkInfo,
  parentId: string,
  callerAddress: string | undefined,
  pageParam: number,
) => {
  if (!selectedNetwork.socialFeedsPkgPath) return { list: [], totalCount: 0 };
  callerAddress = callerAddress || "";

  const limit = gnoZenaoCommentsLimit;
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
    totalCount: postViews.length,
  };
};

const useFetchCommentsRaw = ({ parentId, totalCount, enabled }: ConfigType) => {
  const selectedWallet = useSelectedWallet();
  const [parentNetwork, localIdentifier] = parseNetworkObjectId(parentId);

  const data = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", parentId],
    async ({ pageParam = 0 }) => {
      let comments: FetchCommentResponse;
      // Gno Zenao network
      if (
        parentNetwork?.kind === NetworkKind.Gno &&
        (parentNetwork?.id === gnoZenaoNetwork.id ||
          parentNetwork?.id === gnoZenaoStagingNetwork.id)
      ) {
        return fetchGnoZenaoComments(
          parentNetwork,
          localIdentifier,
          selectedWallet?.address,
          pageParam,
        );
      }
      // Gno network
      else if (parentNetwork?.kind === NetworkKind.Gno) {
        comments = await fetchGnoComments(parentNetwork, localIdentifier);
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
      getNextPageParam: (lastPage, pages) => {
        if (
          parentNetwork?.kind === NetworkKind.Gno &&
          (parentNetwork?.id === gnoZenaoNetwork.id ||
            parentNetwork?.id === gnoZenaoStagingNetwork.id)
        ) {
          if (
            lastPage?.totalCount &&
            lastPage.totalCount >= gnoZenaoCommentsLimit
          ) {
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
