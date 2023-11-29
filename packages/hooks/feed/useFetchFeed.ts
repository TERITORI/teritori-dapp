import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { TERITORI_FEED_ID } from "../../components/socialFeed/const";
import { decodeGnoPost } from "../../components/socialFeed/utils";
import {
  GnoNetworkInfo,
  NetworkInfo,
  NetworkKind,
  parseUserId,
} from "../../networks";
import { mustGetFeedClient } from "../../utils/backend";
import { extractGnoJSONString } from "../../utils/gno";
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
  req: Partial<PostsRequest>,
  pageParam: number,
) => {
  try {
    // ===== We use social-feed contract to get the total posts count
    const client = await nonSigningSocialFeedClient({
      networkId: selectedNetwork.id,
    });
    const mainPostsCount = await client.queryMainPostsCount();

    // Overriding the posts request with the current pageParam as offset
    const postsRequest: Partial<PostsRequest> = {
      ...req,
      offset: pageParam || 0,
    };
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
  req: Partial<PostsRequest>,
  pageParam: number,
) => {
  if (!selectedNetwork.socialFeedsPkgPath) return { list: [], totalCount: 0 };
  callerAddress = callerAddress || "";
  const userId = req.filter?.user || "";

  const [, userAddress] = parseUserId(userId);

  try {
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
  } catch (err) {
    throw err;
  }
};

export const useFetchFeed = (req: Partial<PostsRequest>) => {
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
            if (lastPage?.totalCount && lastPage.totalCount > postsLength) {
              return postsLength;
            }
          }
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};

const getPosts = async (networkId: string, req: Partial<PostsRequest>) => {
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
