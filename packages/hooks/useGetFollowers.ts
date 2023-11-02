import { useQuery } from "@tanstack/react-query";

import { FollowersRequest } from "../api/follow/v1/follow";
import { parseNetworkObjectId } from "../networks";
import { mustGetFollowClient } from "../utils/backend";

export const useGetFollowers = (req: Partial<FollowersRequest>) => {
  const { data } = useQuery(
    ["followers", req],
    async () => {
      const networkId = parseNetworkObjectId(req?.userId);

      if (!networkId) {
        return [];
      }

      const svc = mustGetFollowClient(networkId[0]?.id);
      const { followers } = await svc.Followers(req);
      return followers;
    },
    { staleTime: Infinity }
  );
  return data;
};
