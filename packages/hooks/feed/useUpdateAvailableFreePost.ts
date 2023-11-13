import { useQuery } from "@tanstack/react-query";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getAvailableFreePost } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { Wallet } from "../../context/WalletsProvider";

export const useUpdateAvailableFreePost = (
  networkId: string,
  postCategory: PostCategory,
  wallet?: Wallet,
) => {
  const { data } = useQuery(
    ["getAvailableFreePost", networkId, postCategory, wallet?.address],
    async () => {
      try {
        return (
          (await getAvailableFreePost({
            networkId,
            wallet,
          })) || 0
        );
      } catch (e) {
        console.error("getAvailableFreePost failed :", e);
        return 0;
      }
    },
    { staleTime: Infinity },
  );
  return { freePostCount: data || 0 };
};
