import { useQuery } from "@tanstack/react-query";

import { NotificationsRequest } from "../api/notification/v1/notification";
import { mustGetNotificationClient } from "../utils/backend";

export const useNotifications = (req: Partial<NotificationsRequest>) => {
  const { data, ...other } = useQuery(
    ["notifications", req],
    async () => {
      const networkId = req?.networkId;
      if (!networkId) {
        return [];
      }
      const daoClient = mustGetNotificationClient(networkId);
      const { notifications } = await daoClient.Notifications(req);
      return notifications;
    },
    { staleTime: Infinity }
  );
  return data;
};
