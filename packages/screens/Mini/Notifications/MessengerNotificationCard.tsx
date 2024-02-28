import React from "react";
import { View } from "react-native";

import GradientBox from "../components/GradientBox";

import messageSvg from "@/assets/icons/social-threads/chat.svg";
import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import {
  TypeNotification,
  readNotification,
} from "@/store/slices/notification";
import { store } from "@/store/store";
import {
  neutral22,
  neutralA3,
  primaryColor,
  secondaryColor,
  successColor,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "@/utils/style/fonts";

export default function MessengerNotificationCard({
  item,
}: {
  item: TypeNotification;
}) {
  //   const randomIndex = Math.floor(Math.random() * 4);

  return (
    <FlexRow style={{ backgroundColor: item.isRead ? "" : successColor }}>
      <View style={{ position: "relative" }}>
        {/* {item.img.url ? (
          <SVGorImageIcon
            icon={item.img.url}
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
        )} */}

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

      {item.type === "accept-contact" && (
        <NotificationCardInnerContent
          id={item.id}
          title="You contact request is accepted!"
          date={item.timestamp}
          desc="message by"
          isRead={item.isRead}
        />
      )}
    </FlexRow>
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
    <CustomPressable
      style={{ flex: 1, backgroundColor: neutralA3 }}
      onPress={() => store.dispatch(readNotification({ id }))}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <BrandText style={[fontSemibold14]}>{title}</BrandText>

        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          {date}
        </BrandText>
      </View>

      <SpacerColumn size={0.4} />
      <View style={{ flexDirection: "row" }}>
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
                <BrandText style={[fontSemibold14]}>{user.username}</BrandText>
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
                <BrandText style={[fontSemibold14]}>{user?.username}</BrandText>
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
      </View>
    </CustomPressable>
  );
}
