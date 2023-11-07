import { useQuery } from "@tanstack/react-query";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getPostFee } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";

export const useFeedPostFee = (
  networkId: string,
  postCategory: PostCategory
) => {
  const { data } = useQuery(
    ["getPostFee", networkId, postCategory],
    async () => {
      try {
        return (
          (await getPostFee({
            networkId,
            postCategory,
          })) || 0
        );
      } catch (e) {
        console.error("getPostFee failed: ", e);
        return 0;
      }
    },
    { staleTime: Infinity }
  );
  return { postFee: data || 0 };
};
