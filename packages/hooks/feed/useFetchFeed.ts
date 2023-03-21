import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { mustGetFeedClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export type PostsList = {
  list: Post[];
  totalCount: number;
} | null;

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

export const useFetchFeed = (req: PostsRequest) => {
  const selectedNetworkId = useSelectedNetworkId();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", selectedNetworkId, { ...req }],

      async ({ pageParam = req.offset }) => {
        try {
          // ===== We use social-feed contract to get the total posts count
          const client = await nonSigningSocialFeedClient({
            networkId: selectedNetworkId,
          });
          const mainPostsCount = await client.queryMainPostsCount();

          // Overriding the posts request with the current pageParam as offset
          const postsRequest: PostsRequest = { ...req, offset: pageParam || 0 };
          // Getting posts
          const list = await getPosts(selectedNetworkId, postsRequest);

          return { list, totalCount: mainPostsCount } as PostsList;
        } catch (err) {
          console.error("initData err", err);
          return { list: [], totalCount: 0 } as PostsList;
        }
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
