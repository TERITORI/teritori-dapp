import { useQuery } from "@tanstack/react-query";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getAvailableFreePost } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";

export const useFreePostsCount = (
  userId: string | undefined,
  postCategory: PostCategory,
) => {
  const { data, ...other } = useQuery(
    ["getAvailableFreePost", userId, postCategory],
    async () => {
      if (!userId) {
        return 0;
      }
      try {
        const fee = await getAvailableFreePost(userId);
        return fee;
      } catch (e) {
        console.error("getAvailableFreePost failed :", e);
        return 0;
      }
    },
    { staleTime: Infinity },
  );
  return { freePostCount: data || 0, ...other };
};
