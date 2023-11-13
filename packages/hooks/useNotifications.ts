import { useQuery } from "@tanstack/react-query";

import { NotificationsRequest } from "../api/notification/v1/notification";
import { parseUserId } from "../networks";
import { getNotificationClient } from "../utils/backend";

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
