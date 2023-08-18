import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import {
  GNO_SOCIAL_FEEDS_PKG_PATH,
  TERITORI_FEED_ID,
} from "../../components/socialFeed/const";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import { GnoNetworkInfo, NetworkInfo, NetworkKind } from "../../networks";
import { mustGetFeedClient } from "../../utils/backend";
import { extractGnoString } from "../../utils/gno";
import { useSelectedNetworkInfo } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

export type PostsList = {
  list: Post[];
  totalCount: number;
} | null;

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

const fetchTeritoriFeed = async (
  selectedNetwork: NetworkInfo,
  req: PostsRequest,
  pageParam: number
) => {
  try {
    // ===== We use social-feed contract to get the total posts count
    const client = await nonSigningSocialFeedClient({
      networkId: selectedNetwork.id,
    });
    const mainPostsCount = await client.queryMainPostsCount();

    // Overriding the posts request with the current pageParam as offset
    const postsRequest: PostsRequest = { ...req, offset: pageParam || 0 };
    // Getting posts
    const list = await getPosts(selectedNetwork.id, postsRequest);
    return { list, totalCount: mainPostsCount } as PostsList;
  } catch (err) {
    console.error("teritori initData err", err);
    return { list: [], totalCount: 0 } as PostsList;
  }
};

const fetchGnoFeed = async (
  selectedNetwork: GnoNetworkInfo,
  callerAddress: string | undefined,
  req: PostsRequest,
  pageParam: number
) => {
  if (!callerAddress) {
    return {
      list: [],
      totalCount: 0,
    };
  }

  try {
    const offset = pageParam || 0;
    const limit = 10;
    const categories = req.filter?.categories || []; // Default = all
    const categoriesStr = `[]uint64{${categories.join(",")}}`;

    const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
    const output = await provider.evaluateExpression(
      GNO_SOCIAL_FEEDS_PKG_PATH,
      `GetPostsWithCaller(${TERITORI_FEED_ID}, "${callerAddress}", "", ${categoriesStr}, ${offset}, ${limit})`
    );
    const posts: Post[] = [];

    const outputStr = extractGnoString(output);
    for (const postData of outputStr.split(",")) {
      const post = decodeGnoPost(selectedNetwork.id, postData);
      posts.push(post);
    }

    return {
      list: posts.sort((p1, p2) => p2.createdAt - p1.createdAt),
      totalCount: posts.length,
    } as PostsList;
  } catch (err) {
    throw err;
  }
};

export const useFetchFeed = (req: PostsRequest) => {
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
          const postsLength = combineFetchFeedPages(pages).length;
          if (lastPage?.totalCount && lastPage.totalCount > postsLength) {
            return postsLength;
          }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      }
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};

const getPosts = async (networkId: string, req: PostsRequest) => {
  try {
    // ===== We use FeedService to be able to fetch filtered posts
    const feedClient = mustGetFeedClient(networkId);
    const response = await feedClient.Posts(req);
    // ---- We sort by creation date
    return response.posts.sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.log("initData err", err);
    return [] as Post[];
  }
};
