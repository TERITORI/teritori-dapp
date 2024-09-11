import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSelectedNetworkInfo } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

import {
  AggregatedPost,
  Post,
  PostsWithLocationRequest,
  PostsRequest,
} from "@/api/feed/v1/feed";
import {
  GnoNetworkInfo,
  NetworkInfo,
  NetworkKind,
  parseUserId,
} from "@/networks";
import { mustGetFeedClient } from "@/utils/backend";
import { TERITORI_FEED_ID } from "@/utils/feed/constants";
import { decodeGnoPost } from "@/utils/feed/gno";
import { extractGnoJSONString } from "@/utils/gno";
import { DeepPartial } from "@/utils/typescript";

interface PostsWithAggregations {
  list: Post[];
  totalCount: number;
  aggregations: AggregatedPost[];
}

export type PostsList = {
  list: Post[];
  totalCount: number | undefined;
};

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

export const combineFetchFeedAggregationsPages = (
  pages: PostsWithAggregations[],
) =>
  pages.reduce(
    (acc: AggregatedPost[], page) => [...acc, ...(page?.aggregations || [])],
    [],
  );

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
  return { list, totalCount: undefined };
};

const fetchGnoFeed = async (
  selectedNetwork: GnoNetworkInfo,
  callerAddress: string | undefined,
  req: DeepPartial<PostsRequest>,
  pageParam: number,
) => {
  if (!selectedNetwork.socialFeedsPkgPath) return { list: [], totalCount: 0 };
  callerAddress = callerAddress || "";
  const userId = req.filter?.user || "";

  const [, userAddress] = parseUserId(userId);

  const offset = pageParam || 0;
  const limit = req.limit;
  const categories = req.filter?.categories || []; // Default = all
  const categoriesStr = `[]uint64{${categories.join(",")}}`;
  const parentId = 0;

  const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
  const output = await provider.evaluateExpression(
    selectedNetwork.socialFeedsPkgPath,
    `GetPostsWithCaller(${TERITORI_FEED_ID}, ${parentId}, "${callerAddress}", "${userAddress}", ${categoriesStr}, ${offset}, ${limit})`,
  );

  const posts: Post[] = [];
  const gnoPosts = extractGnoJSONString(output);

  for (const gnoPost of gnoPosts) {
    const post = decodeGnoPost(selectedNetwork.id, gnoPost);
    posts.push(post);
  }

  const result = {
    list: posts.sort((p1, p2) => p2.createdAt - p1.createdAt),
    totalCount: posts.length,
  } as PostsList;
  return result;
};

export const useFetchFeed = (req: DeepPartial<PostsRequest>) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const wallet = useSelectedWallet();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", selectedNetwork?.id, wallet?.address, { ...req }],
      async ({ pageParam = req.offset }) => {
        if (selectedNetwork?.kind === NetworkKind.Cosmos) {
          return fetchTeritoriFeed(selectedNetwork, req, pageParam);
        } else if (selectedNetwork?.kind === NetworkKind.Gno) {
          return fetchGnoFeed(selectedNetwork, wallet?.address, req, pageParam);
        }

        throw Error(`Network ${selectedNetwork?.id} is not supported`);
      },
      {
        getNextPageParam: (lastPage, pages) => {
          // NOTE: On gno feeds, due to list length depends on each user (due to flag, hide)
          // so if last page contains posts = limit => try to load more content
          if (selectedNetwork?.kind === NetworkKind.Gno) {
            if (lastPage?.totalCount && lastPage.totalCount === req.limit) {
              return pages.length * req.limit;
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
  const selectedNetwork = useSelectedNetworkInfo();
  const wallet = useSelectedWallet();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", selectedNetwork?.id, wallet?.address, { ...req }],
      async () => {
        if (!selectedNetwork)
          return Promise.resolve({
            list: [],
            totalCount: 0,
            aggregations: [],
          });
        return fetchTeritoriFeedLocation(selectedNetwork, req);
      },
      {
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};

const fetchTeritoriFeedLocation = async (
  selectedNetwork: NetworkInfo,
  req: Partial<PostsWithLocationRequest>,
): Promise<PostsWithAggregations> => {
  const feedClient = mustGetFeedClient(selectedNetwork.id);
  const response = await feedClient.PostsWithLocation(req);
  const list = response.posts.sort((a, b) => b.createdAt - a.createdAt);
  return {
    list,
    totalCount: list.length,
    aggregations: response.aggregatedPosts,
  };
};
