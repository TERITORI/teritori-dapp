import React from "react";
import { View, FlatList } from "react-native";

import NotificationCard from "./NotificationCard";
import { notifications } from "./notificationData";
import { Separator } from "../../../components/separators/Separator";
import { layout } from "../../../utils/style/layout";

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

export default function NotificationList() {
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
          <React.Fragment key={item.notificationId}>
            <NotificationCard item={item} />
            <Separator style={{ marginVertical: 12 }} />
          </React.Fragment>
        )}
      />
    </View>
  );
}
