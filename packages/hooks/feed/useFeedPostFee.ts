import { useQuery } from "@tanstack/react-query";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getPostFee } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { getStakingCurrency } from "../../networks";
import { prettyPrice } from "../../utils/coins";

export const useFeedPostFee = (
  networkId: string | undefined,
  postCategory: PostCategory,
) => {
  const feeCurrency = getStakingCurrency(networkId);
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
  const postFee = data || 0;
  return {
    prettyPostFee: prettyPrice(
      networkId,
      postFee.toString(),
      feeCurrency?.denom,
    ),
    postFee,
  };
};
