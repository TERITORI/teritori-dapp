import React from "react";
import { FlatList, View } from "react-native";

import MessengerNotificationCard from "./MessengerNotificationCard";

import { Separator } from "@/components/separators/Separator";
import { TypeNotification } from "@/store/slices/notification";
import { layout } from "@/utils/style/layout";

export type NotificationType = {
  notificationId: string;
  img: { url: string };
  type: string;
  user?: { id: string; username: string; avatarUrl: string };
  price?: number;
  message?: string;
  postedAt: string;
  for?: string;
  from?: string;
  to?: string;
};

export default function NotificationList({
  notifications,
}: {
  notifications: TypeNotification[];
}) {
  return (
    <View
      style={{
        padding: layout.spacing_x2,
        position: "relative",
        zIndex: 0,
      }}
    >
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <React.Fragment key={item.id}>
            <MessengerNotificationCard item={item} />
            <Separator style={{ marginVertical: layout.spacing_x1_5 }} />
          </React.Fragment>
        )}
      />
    </View>
  );
}
