import { useQuery } from "@tanstack/react-query";

import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../useSelectedNetwork";

export const useFetchPost = (id: string) => {
  const { setToastError } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();

  const { data, isLoading, isFetching } = useQuery(
    ["queryPost", selectedNetworkId, id],
    async () => {
      try {
        const client = await nonSigningSocialFeedClient({
          networkId: selectedNetworkId,
        });
        return await client.queryPost({ identifier: id });
      } catch (error) {
        setToastError({
          title: "",
          message: error.message,
        });
        return {};
      }
    },
    {
      staleTime: Infinity,
    }
  );

  return { postResult: data, isLoading, isFetching };
};
