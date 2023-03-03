import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { mustGetFeedClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

export type PostsList = {
  list: Post[];
} | null;

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

export const useFetchFeed = (req: PostsRequest) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", { ...req }],

      async ({ pageParam = req.limit }) => {
        try {
          // ===== We use FeedService to be able to fetch filtered posts
          const feedClient = mustGetFeedClient(selectedNetworkId);
          // ===== We use social-feed contract to get the total posts count
          const feedContractClient = await socialFeedClient({
            networkId: selectedNetworkId,
            walletAddress: wallet?.address || "",
          });
          const postsResponse = await feedClient.Posts({
            ...req,
            offset: pageParam || 0,
          });
          const mainPostsCount = await feedContractClient.queryMainPostsCount();
          return { list: postsResponse.posts, totalCount: mainPostsCount };
        } catch (err) {
          console.log("initData err", err);
          return null;
        }
      },
      {
        getNextPageParam: (lastPage, pages) => {
          const postsLength = combineFetchFeedPages(pages).length;

          if (lastPage?.totalCount && lastPage.totalCount > postsLength) {
            return postsLength;
          }
          return null;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      }
    );
  return { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading };
};
