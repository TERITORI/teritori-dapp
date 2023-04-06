import { useCallback, useState } from "react";

import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { getPostFee } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";

// FIXME: use react-query
export const useUpdatePostFee = () => {
  const [postFee, setPostFee] = useState(0);
  const updatePostFee = useCallback(
    async (networkId: string, postCategory: PostCategory) => {
      const fee = await getPostFee({
        networkId,
        postCategory,
      });
      setPostFee(fee || 0);
    },
    []
  );
  return { postFee, updatePostFee };
};
