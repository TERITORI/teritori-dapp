import { useQuery } from "@tanstack/react-query";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getPostFee } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";

export const useUpdatePostFee = (
  networkId: string,
  postCategory: PostCategory
) => {
  const { data } = useQuery([networkId, postCategory], async () => {
    return await getPostFee({
      networkId,
      postCategory,
    });
  });
  return { postFee: data || 0 };
};
