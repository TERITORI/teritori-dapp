import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { useSelectedNetworkInfo } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

import {
  AggregatedPost,
  Post,
  PostsWithLocationRequest,
  PostsRequest,
} from "@/api/feed/v1/feed";
import { GnoNetworkInfo, NetworkInfo, NetworkKind } from "@/networks";
import { mustGetFeedClient } from "@/utils/backend";
import { postViewsFromJson, postViewsToPostsList } from "@/utils/feed/gno";
import { extractGnoJSONResponse } from "@/utils/gno";
import { PostsList } from "@/utils/types/feed";
import { DeepPartial } from "@/utils/typescript";

interface PostsWithAggregations {
  list: Post[];
  totalCount: number;
  aggregations: AggregatedPost[];
}

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

const fetchTeritoriFeed = async (
  selectedNetwork: NetworkInfo,
  req: DeepPartial<PostsRequest>,
  pageParam: number,
) => {
  const postsRequest: DeepPartial<PostsRequest> = {
    ...req,
    offset: pageParam || 0,
  };
  const feedClient = mustGetFeedClient(selectedNetwork.id);
  const response = await feedClient.Posts(postsRequest);
  const list = response.posts.sort((a, b) => b.createdAt - a.createdAt);
  return { list, totalCount: list.length };
};

const fetchGnoFeed = async (
  selectedNetwork: GnoNetworkInfo,
  callerAddress: string | undefined,
  req: DeepPartial<PostsRequest>,
  pageParam: number,
) => {
  if (!selectedNetwork.socialFeedsPkgPath || req.filter?.categories?.length) {
    return { list: [], totalCount: 0 };
  }
  callerAddress = callerAddress || "";

  const limit = req.limit || 0;
  const offset = pageParam * limit;
  const tags = "";

  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);

  const output = await provider.evaluateExpression(
    selectedNetwork.socialFeedsPkgPath || "",
    `postViewsToJSON(GetFeedPosts("${selectedNetwork.globalFeedId}", ${offset}, ${limit}, "${tags}", "${callerAddress}"))`,
  );
  const raw = extractGnoJSONResponse(output);
  const postViews = postViewsFromJson(raw);
  return postViewsToPostsList(postViews, selectedNetwork.id);
};

export const useFetchFeed = (req: DeepPartial<PostsRequest>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const wallet = useSelectedWallet();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", selectedNetwork?.id, wallet?.address, { ...req }],
      async ({ pageParam = req.offset }) => {
        // Cosmos networks
        if (selectedNetwork?.kind === NetworkKind.Cosmos) {
          return fetchTeritoriFeed(selectedNetwork, req, pageParam);
        }
        // Gno network
        else if (selectedNetwork?.kind === NetworkKind.Gno) {
          return fetchGnoFeed(selectedNetwork, wallet?.address, req, pageParam);
        }

        throw Error(`Network ${selectedNetwork?.id} is not supported`);
      },
      {
        getNextPageParam: (lastPage, pages) => {
          if (selectedNetwork?.kind === NetworkKind.Gno) {
            if (
              lastPage.totalCount &&
              req.limit &&
              lastPage.totalCount >= req.limit
            ) {
              return pages.length;
            }
          } else {
            const postsLength = combineFetchFeedPages(pages).length;
            return postsLength;
          }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};

export const useFetchFeedLocation = (
  req: Partial<PostsWithLocationRequest>,
) => {
  return useQuery(
    ["postsWithLocation", req],
    async () => {
      return await fetchTeritoriFeedLocation(req);
    },
    {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  );
};

const fetchTeritoriFeedLocation = async (
  req: Partial<PostsWithLocationRequest>,
): Promise<PostsWithAggregations> => {
  const feedClient = mustGetFeedClient(req.networkId);
  const response = await feedClient.PostsWithLocation(req);
  const list = response.posts.sort((a, b) => b.createdAt - a.createdAt);
  return {
    list,
    totalCount: list.length,
    aggregations: response.aggregatedPosts,
  };
};
