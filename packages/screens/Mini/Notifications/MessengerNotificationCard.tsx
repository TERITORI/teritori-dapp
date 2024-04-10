import moment from "moment";
import React, { useMemo } from "react";
import { View } from "react-native";

import { randomGradients } from "./notificationData";
import GradientBox from "../components/GradientBox";

import DoubleCheckWhiteSVG from "@/assets/icons/double-check-white.svg";
import DoubleCheckSVG from "@/assets/icons/double-check.svg";
import messageSvg from "@/assets/icons/social-threads/chat.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import {
  TypeNotification,
  readNotification,
} from "@/store/slices/notification";
import { store } from "@/store/store";
import { useAppNavigation } from "@/utils/navigation";
import { neutralA3 } from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export default function MessengerNotificationCard({
  item,
}: {
  item: TypeNotification;
}) {
  const navigation = useAppNavigation();
  const randomIndex = useMemo(() => Math.floor(Math.random() * 4), []);

  return (
    <CustomPressable
      style={{
        flexDirection: "row",
      }}
      onPress={() => {
        store.dispatch(readNotification({ id: item.id }));

        if (item.type === "contact-request") {
          navigation.navigate("MiniFriend", { activeTab: "requests" });
        }

        if (item.type === "group-invite") {
          navigation.navigate("Conversation", { conversationId: item?.id });
        }

        if (item.type === "group-join") {
          navigation.navigate("Conversation", { conversationId: item?.id });
        }
      }}
    >
      <View style={{ position: "relative" }}>
        {item.avatar ? (
          <SVGorImageIcon
            icon={item.avatar}
            iconSize={48}
            style={{
              borderRadius: 6,
            }}
          />
        ) : (
          <GradientBox
            colors={randomGradients[randomIndex].colors}
            direction={randomGradients[randomIndex].direction ?? "topBottom"}
          />
        )}

        <View
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: 20,
            backgroundColor: "#fff",
            right: -5,
            bottom: -5,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SVG source={messageSvg} width={16} height={16} fill="#000000" />
        </View>
      </View>
      <SpacerRow size={3} />

      {item.type === "contact-request" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You have received a new contact request!"
          date={item.timestamp}
          isRead={item.isRead}
        />
      )}

      {item.type === "group-invite" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You have received a group join request!"
          date={item.timestamp}
          isRead={item.isRead}
        />
      )}

      {item.type === "group-join" && (
        <NotificationCardInnerContent
          id={item.id}
          title="Group join request is accepted!"
          date={item.timestamp}
          isRead={item.isRead}
        />
      )}
    </CustomPressable>
  );
}

interface NotiCardContentProps {
  id: string;
  isRead: boolean;
  title: string;
  date?: string;
}

function NotificationCardInnerContent({
  title,
  date,
  isRead,
}: NotiCardContentProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: layout.spacing_x2,
      }}
    >
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <BrandText style={[fontSemibold14]} numberOfLines={2}>
            {title}
          </BrandText>
        </View>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          {moment(date).fromNow()}
        </BrandText>
        <SpacerColumn size={0.4} />
        {!isRead ? (
          <SVG source={DoubleCheckSVG} height={16} width={16} />
        ) : (
          <SVG source={DoubleCheckWhiteSVG} height={16} width={16} />
        )}
      </View>
    </View>
  );
}
