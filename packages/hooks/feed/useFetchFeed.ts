import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { mustGetFeedClient } from "../../utils/backend";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "../useSelectedNetwork";
import { GnoNetworkInfo, NetworkInfo, NetworkKind } from "../../networks";
import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import useSelectedWallet from "../useSelectedWallet";
import { Wallet } from "ethers";
import { extractGnoString } from "../../utils/gno";

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
  wallet: Wallet,
  req: PostsRequest,
  pageParam: number
) => {
  try {
    try {
      const provider = new GnoJSONRPCProvider(selectedNetwork.endpoint);
      const username = await provider.evaluateExpression(
        "gno.land/r/demo/users",
        `GetUserByAddress("${wallet.address}").name`
      );
      const gnoUsename = extractGnoString(username);
      console.log(gnoUsename, "=================")
      return `${gnoUsename}.gno`;
    } catch (err) {
      throw err;
    }

    const mainPostsCount = await client.queryMainPostsCount();

    // Overriding the posts request with the current pageParam as offset
    const postsRequest: PostsRequest = { ...req, offset: pageParam || 0 };
    // Getting posts
    const list = await getPosts(selectedNetworkId, postsRequest);

    return { list, totalCount: mainPostsCount } as PostsList;
  } catch (err) {
    console.error("gno initData err", err);
    return { list: [], totalCount: 0 } as PostsList;
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
          return fetchGnoFeed(selectedNetwork, wallet, req, pageParam);
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
