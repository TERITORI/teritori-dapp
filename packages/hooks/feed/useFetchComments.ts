import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { TERITORI_FEED_ID } from "../../components/socialFeed/const";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import {
  PostResult,
  Reaction,
} from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import {
  GnoNetworkInfo,
  NetworkKind,
  parseNetworkObjectId,
} from "../../networks";
import { extractGnoString } from "../../utils/gno";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";

export type FetchCommentResponse = {
  list: PostResult[];
} | null;

export type PostResultWithCreatedAt = PostResult & {
  created_at: number;
};

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
): Promise<FetchCommentResponse> => {
  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
  const output = await provider.evaluateExpression(
    selectedNetwork.socialFeedsPkgPath || "",
    `GetComments(${TERITORI_FEED_ID}, ${parentId})`
  );

  const posts: PostResultWithCreatedAt[] = [];

  const outputStr = extractGnoString(output);
  for (const postData of outputStr.split(",")) {
    const post = decodeGnoPost(selectedNetwork.id, postData);
    const [, creatorAddress] = parseNetworkObjectId(post.authorId);

    posts.push({
      identifier: post.identifier,
      parent_post_identifier: post.parentPostIdentifier,
      category: post.category,
      metadata: post.metadata,
      reactions: post.reactions as Reaction[],
      user_reactions: [],
      post_by: creatorAddress,
      deleted: post.isDeleted,
      sub_post_length: post.subPostLength,
      tip_amount: "" + post.tipAmount,
      created_at: post.createdAt,
    });
  }

  return {
    list: posts.sort((p1, p2) => p2.created_at - p1.created_at) as PostResult[],
  };
};

export const useFetchComments = ({
  parentId,
  totalCount,
  enabled,
}: ConfigType) => {
  const selectedNetwork = useSelectedNetworkInfo();

  // request
  const data = useInfiniteQuery<FetchCommentResponse>(
    ["FetchComment", parentId, selectedNetwork?.id],
    async ({ pageParam }) => {
      let comments: FetchCommentResponse;
      if (selectedNetwork?.kind === NetworkKind.Gno) {
        comments = await fetchGnoComments(selectedNetwork, parentId || "");
      } else {
        comments = await fetchTeritoriComments(
          selectedNetwork?.id || "",
          pageParam,
          parentId
        );
      }
      return comments;
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
