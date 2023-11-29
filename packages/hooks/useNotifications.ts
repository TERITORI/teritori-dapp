import { useQuery } from "@tanstack/react-query";

import {
  FollowingUsersRequest,
  NotificationsRequest,
} from "../api/notification/v1/notification";
import { parseNetworkObjectId, parseUserId } from "../networks";
import {
  getNotificationClient,
  mustGetNotificationClient,
} from "../utils/backend";

export const notificationsQueryKey = (userId: string | undefined) => [
  "notifications",
  userId,
];

export const useNotifications = (req: Partial<NotificationsRequest>) => {
  const { userId, ...rest } = req;
  const { data } = useQuery(
    [...notificationsQueryKey(userId), rest],
    async () => {
      const [network] = parseUserId(req?.userId);
      if (!network) {
        return [];
      }

      const notificationClient = getNotificationClient(network.id);
      if (!notificationClient) {
        return [];
      }

      const { notifications } = await notificationClient.Notifications(req);
      return notifications;
    },
    { staleTime: Infinity, refetchInterval: 10000 },
  );
  return data;
};

export const useFollowingUserNotifications = (
  req: Partial<FollowingUsersRequest>,
) => {
  const { data } = useQuery(
    ["followingUserNotifications", req],
    async () => {
      const networkId = parseNetworkObjectId(req?.userId);

      if (!networkId) {
        return [];
      }

      const notificationService = mustGetNotificationClient(networkId[0]?.id);
      const { notifications } = await notificationService.FollowingUsers(req);
      return notifications;
    },
    { staleTime: Infinity, refetchInterval: 10000 },
  );
  return data;
};
