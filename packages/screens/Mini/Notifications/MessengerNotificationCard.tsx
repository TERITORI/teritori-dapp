import React from "react";
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
  const randomIndex = Math.floor(Math.random() * 4);
  const navigation = useAppNavigation();

  return (
    <CustomPressable
      style={{
        flexDirection: "row",
      }}
      onPress={() => {
        store.dispatch(readNotification({ id: item.id }));

        // TODO: Change to appropriate routes
        if (item.type === "message") {
          navigation.navigate("MiniChats", {});
        }

        if (item.type === "contact-request") {
          navigation.navigate("MiniChats", {});
        }

        if (item.type === "group-join") {
          navigation.navigate("MiniChats", {});
        }
      }}
    >
      {/* <FlexRow style={{ backgroundColor: azureBlue20 }}> */}
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

      {item.type === "message" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You received a new message!"
          date={item.timestamp}
          desc="message by"
          isRead={item.isRead}
        />
      )}

      {item.type === "contact-request" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You have received a new contact request!"
          date={item.timestamp}
          desc="message by"
          isRead={item.isRead}
        />
      )}

      {item.type === "group-join" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You have received a group join request!"
          date={item.timestamp}
          desc="message by"
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
  date: string;
  desc: string;
  link?: string;
  user?: { userAvatar?: string; username: string; id: string };
}

function NotificationCardInnerContent({
  id,
  title,
  date,
  desc,
  link,
  isRead,
  user,
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

        {/* <SpacerColumn size={0.4} /> */}
        {/* <View style={{ flexDirection: "row" }}>
          <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
            {desc}
          </BrandText>

          {user && (
            <>
              {user?.userAvatar ? (
                <>
                  <SpacerRow size={1} />
                  <SVGorImageIcon
                    icon={user.userAvatar}
                    iconSize={18}
                    style={{
                      borderRadius: 18 / 2,
                    }}
                  />
                  <BrandText style={[fontSemibold14]}>
                    {user.username}
                  </BrandText>
                </>
              ) : (
                <>
                  <SpacerRow size={1} />
                  <GradientBox
                    colors={[secondaryColor, primaryColor]}
                    size={18}
                    radius={9}
                  />
                  <SpacerRow size={0.7} />
                  <BrandText style={[fontSemibold14]}>
                    {user?.username}
                  </BrandText>
                </>
              )}
            </>
          )}

          {link && (
            <>
              <SpacerRow size={0.7} />
              <BrandText style={[fontSemibold14]}>{link}</BrandText>
            </>
          )}
        </View> */}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          {date}
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
