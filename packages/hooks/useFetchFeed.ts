import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { socialFeedClient } from "../client-creators/socialFeedClient";
import { PostCategory } from "../components/socialFeed/NewsFeed/NewsFeed.type";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "./useSelectedWallet";

export type FetchFeedResponse = {
  list: PostResult[];
  totalCount: number;
} | null;

export type FeedRequest = {
  count?: number;
  from?: number;
  sort?: string;
  user?: string;
  hash?: string;
  categories?: PostCategory[];
};

export const combineFetchFeedPages = (pages: FetchFeedResponse[]) =>
  pages.reduce(
    (acc: PostResult[], page) => [...acc, ...(page?.list || [])],
    []
  );

export const useFetchFeed = (req?: FeedRequest) => {
  // variable
  const wallet = useSelectedWallet();

  const categoriesKey = useMemo(() => {
    let result = "";
    req?.categories?.forEach((cat) => {
      result += `${cat}`;
    });
    return result;
  }, [req?.categories]);

  // request posts
  const data = useInfiniteQuery<FetchFeedResponse>(
    [
      "FetchFeed",
      req?.count,
      req?.from,
      req?.sort,
      req?.user,
      categoriesKey,
      // req?.hash,
    ],
    async ({ pageParam }) => {
      try {
        const client = await socialFeedClient({
          walletAddress: wallet?.address || "",
        });

        const mainPosts = await client.queryMainPosts({
          count: req?.count || 10,
          from: req?.from || pageParam || 0,
          sort: req?.sort || "desc",
          // categories: req?.categories
          // hash: req?.hash
          user: req?.user,
        });

        const mainPostCount = await client.queryMainPostsCount();
        return { list: mainPosts, totalCount: mainPostCount };
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

  return data;
};
