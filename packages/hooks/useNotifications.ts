import { useQuery } from "@tanstack/react-query";

import { NotificationsRequest } from "../api/notification/v1/notification";
import { parseNetworkObjectId } from "../networks";
import { mustGetNotificationClient } from "../utils/backend";

export const useNotifications = (req: Partial<NotificationsRequest>) => {
  const { data } = useQuery(
    ["notifications", req],
    async () => {
      const networkId = parseNetworkObjectId(req?.userId);
      debugger;
      if (!networkId) {
        return [];
      }
      const notificationService = mustGetNotificationClient(networkId[0]?.id);
      const { notifications } = await notificationService.Notifications(req);
      return notifications;
    },
    { staleTime: Infinity }
  );
  return data;
};
