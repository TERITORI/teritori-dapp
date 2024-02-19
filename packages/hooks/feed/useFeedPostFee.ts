import { useQuery } from "@tanstack/react-query";

import { getPostFee } from "@/utils/feed/queries";
import { PostCategory } from "@/utils/types/feed";

export const useFeedPostFee = (
  networkId: string | undefined,
  postCategory: PostCategory,
) => {
  const { data } = useQuery(
    ["getPostFee", networkId, postCategory],
    async () => {
      if (!networkId) return 0;
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
    { staleTime: Infinity },
  );
  return { postFee: data || 0 };
};
