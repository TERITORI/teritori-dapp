import { useQuery } from "@tanstack/react-query";

import { nonSigningSocialFeedClient } from "../../client-creators/socialFeedClient";

export const usePost = (id: string, networkId: string) => {
  const { data, ...other } = useQuery(
    ["social-post", id, networkId],
    async () => {
      const client = await nonSigningSocialFeedClient({
        networkId,
      });
      return await client.queryPost({ identifier: id });
    }
  );
  return { post: data, ...other };
};
