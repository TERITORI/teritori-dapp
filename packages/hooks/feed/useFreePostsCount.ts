import { useQuery } from "@tanstack/react-query";

import { getAvailableFreePost } from "../../utils/feed/queries";
import { PostCategory } from "../../utils/types/feed";

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
