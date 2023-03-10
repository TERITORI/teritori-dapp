import { useInfiniteQuery } from "@tanstack/react-query";

import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { mustGetFeedClient } from "../../utils/backend";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

export type PostsList = {
  list: Post[];
  totalCount: number;
} | null;

export const combineFetchFeedPages = (pages: PostsList[]) =>
  pages.reduce((acc: Post[], page) => [...acc, ...(page?.list || [])], []);

export const useFetchFeed = (req: PostsRequest, isUpp?: boolean) => {
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(
      ["posts", selectedNetworkId, { ...req }],

      async ({ pageParam = req.offset }) => {
        try {
          // ===== We use social-feed contract to get the total posts count
          const feedContractClient = await socialFeedClient({
            networkId: selectedNetworkId,
            walletAddress: wallet?.address || "",
          });
          const mainPostsCount = await feedContractClient.queryMainPostsCount();

          // Overriding the posts request with the current pageParam as offset
          const postsRequest: PostsRequest = { ...req, offset: pageParam || 0 };

          // Getting posts
          let list: Post[] = [];
          if (isUpp) {
            list = await getUPPPosts(selectedNetworkId, postsRequest);
          } else {
            list = await getPosts(selectedNetworkId, postsRequest);
          }

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

const getUPPPosts = async (networkId: string, req: PostsRequest) => {
  const ownerReq: PostsRequest = {
    ...req,
    filter: req.filter ? { ...req.filter, mentions: [] } : undefined,
  };
  const mentionsReq: PostsRequest = {
    ...req,
    filter: req.filter ? { ...req.filter, user: "" } : undefined,
  };
  // ---- We get posts by UPP user's id and by mentions
  const ownerPosts = await getPosts(networkId, ownerReq);
  const mentionsPosts = await getPosts(networkId, mentionsReq);
  // ---- We merge these posts
  const posts = [...mentionsPosts, ...ownerPosts];
  // ---- We remove the duplications (sorting by identifier, then remove index+1 if it's the same identifier) and
  const cleanedPosts = posts
    .sort(comparePosts)
    .filter(
      (item, index, posts) => item.identifier !== posts[index + 1]?.identifier
    )
    .sort((a, b) => b.createdAt - a.createdAt);
  // ---- We sort by creation date
  const sortedPosts = cleanedPosts.sort((a, b) => b.createdAt - a.createdAt);
  // ---- We remove extra posts (respecting limit)
  //FIXME: Some posts are skipped because of slice here
  return sortedPosts.length > req.limit
    ? sortedPosts.slice(0, req.limit)
    : sortedPosts;
};

// Used to sort posts by identifier
const comparePosts = (a: Post, b: Post) => {
  if (a.identifier < b.identifier) {
    return -1;
  }
  if (a.identifier > b.identifier) {
    return 1;
  }
  return 0;
};
