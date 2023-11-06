import { useQuery } from "@tanstack/react-query";

import { NotificationsRequest } from "../api/notification/v1/notification";
import { parseUserId } from "../networks";
import { mustGetNotificationClient } from "../utils/backend";

export const useNotifications = (req: Partial<NotificationsRequest>) => {
  const { data } = useQuery(
    ["notifications", req],
    async () => {
      const [network] = parseUserId(req?.userId);

      if (!network) {
        return [];
      }

      const notificationService = mustGetNotificationClient(network.id);
      const { notifications } = await notificationService.Notifications(req);
      return notifications;
    },
    { staleTime: Infinity }
  );
  return data;
};
