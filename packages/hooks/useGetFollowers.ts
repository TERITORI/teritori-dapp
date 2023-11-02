import { useQuery } from "@tanstack/react-query";

import {
  FollowersRequest,
  UserFollowStatsRequest,
  UserFollowsUserRequest,
} from "../api/follow/v1/follow";
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

export const useGetFollowersStats = (req: Partial<UserFollowStatsRequest>) => {
  const { data } = useQuery(
    ["followers-stats", req],
    async () => {
      const networkId = parseNetworkObjectId(req?.userId);

      if (!networkId) {
        return {
          followers: 0,
          following: 0,
        };
      }

      const svc = mustGetFollowClient(networkId[0]?.id);
      const { followers, following } = await svc.UserFollowStats(req);
      return { followers, following };
    },
    { staleTime: Infinity }
  );
  return data
    ? data
    : {
        followers: 0,
        following: 0,
      };
};

export const useUserFollowsUser = (req: Partial<UserFollowsUserRequest>) => {
  const { data } = useQuery(
    ["user-follows-user", req],
    async () => {
      const networkId = parseNetworkObjectId(req?.userId);

      if (!networkId) {
        return false;
      }

      const svc = mustGetFollowClient(networkId[0]?.id);
      const { status } = await svc.UserFollowsUser(req);
      return status;
    },
    { staleTime: Infinity }
  );
  return data;
};
