import { useState } from "react";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getPostFee } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { Wallet } from "../../context/WalletsProvider";

export const useUpdatePostFee = () => {
  const [postFee, setPostFee] = useState(0);
  const updatePostFee = async (
    networkId: string,
    postCategory: PostCategory,
    wallet?: Wallet
  ) => {
    const fee = await getPostFee({
      networkId,
      wallet,
      postCategory,
    });
    setPostFee(fee || 0);
  };
  return { postFee, updatePostFee };
};
