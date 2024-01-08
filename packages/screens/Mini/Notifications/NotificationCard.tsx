import React from "react";
import { View } from "react-native";

import { NotificationType } from "./NotificationList";
import GradientBox from "./components/GradientBox";
import { randomGradients } from "./notificationData";
import messageSvg from "../../../../assets/icons/social-threads/chat.svg";
import commentSvg from "../../../../assets/icons/social-threads/message.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { SVGorImageIcon } from "../../../components/SVG/SVGorImageIcon";
import { SpacerRow } from "../../../components/spacer";
import {
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";

type NotificationCardProps = {
  item: NotificationType;
};

export default function NotificationCard({ item }: NotificationCardProps) {
  const randomIndex = Math.floor(Math.random() * 4);

  return (
    <FlexRow>
      <View style={{ position: "relative" }}>
        {item.img.url ? (
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
          <SVG
            source={
              item.type === "comment"
                ? commentSvg
                : item.type === "purchase"
                  ? commentSvg
                  : messageSvg
            }
            width={16}
            height={16}
            fill="#000000"
          />
        </View>
      </View>
      <SpacerRow size={3} />

      {item.type === "comment" && (
        <NotificationCardInnerContent
          title={item.message ?? ""}
          date={item.postedAt}
          desc="commented by"
          user={item.user}
        />
      )}

      {item.type === "purchase" && (
        <NotificationCardInnerContent
          title={item.message ?? ""}
          date={item.postedAt}
          desc="bought by"
          link={`for ${item.price} TORI` ?? ""}
          user={item.user}
        />
      )}

      {item.type === "collection" && (
        <NotificationCardInnerContent
          title={item.message ?? ""}
          date={item.postedAt}
          desc="new collection"
          link="read more"
        />
      )}
      {item.type === "tip" && (
        <NotificationCardInnerContent
          title={`${item.from} tipped you`}
          date={item.postedAt}
          desc={`${item.price} TORI for`}
          link={item.for ?? ""}
        />
      )}

      {item.type === "transfer" && (
        <NotificationCardInnerContent
          title={`${item.from} made you a transfer` ?? ""}
          date={item.postedAt}
          desc={`${item.price} TORI`}
        />
      )}
    </FlexRow>
  );
}

type NotiCardContentProps = {
  title: string;
  date: string;
  desc: string;
  link?: string;
  user?: { userAvatar?: string; username: string; id: string };
};

function NotificationCardInnerContent({
  title,
  date,
  desc,
  link,
  user,
}: NotiCardContentProps) {
  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}
