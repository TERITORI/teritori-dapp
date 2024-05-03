import React from "react";
import { FlatList, View, useWindowDimensions } from "react-native";

import MessengerNotificationCard from "./MessengerNotificationCard";

import NoNotificaionsSVG from "@/assets/icons/no-notifications.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { Separator } from "@/components/separators/Separator";
import { TypeNotification } from "@/store/slices/notification";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium16 } from "@/utils/style/fonts";
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
  const { height: windowHeight } = useWindowDimensions();
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
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: windowHeight - 220,
            }}
          >
            <SVG source={NoNotificaionsSVG} height={148} width={148} />
            <BrandText
              style={[
                fontMedium16,
                { color: neutral77, marginTop: layout.spacing_x2_5 },
              ]}
            >
              No notifications yet
            </BrandText>
          </View>
        }
      />
    </View>
  );
}
