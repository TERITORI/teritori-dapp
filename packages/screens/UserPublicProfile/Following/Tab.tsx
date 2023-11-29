import moment from "moment/moment";
import React from "react";
import { FlatList, ScrollView, View } from "react-native";

import { Notification } from "../../../api/notification/v1/notification";
import { BrandText } from "../../../components/BrandText";
import { OmniLink } from "../../../components/OmniLink";
import { UserNameInline } from "../../../components/UserNameInline";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useFollowingUserNotifications } from "../../../hooks/useNotifications";
import { prettyPrice } from "../../../utils/coins";
import {
  neutral33,
  neutral44,
  neutral77,
  purpleDark,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontBold12,
  fontSemibold12,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";

export const Tab: React.FC<{ userId: string }> = ({ userId }) => {
  const notifications = useFollowingUserNotifications({
    userId,
  });

  return (
    <View>
      <NotificationList notifications={notifications} />
    </View>
  );
};

const NotificationList: React.FC<{
  notifications: Notification[] | undefined;
}> = ({ notifications }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        height: "100%",
        // width: topMenuWidth - 2,
      }}
    >
      <FlatList
        key="notification-list"
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            key={`${item.triggerBy}-${item.createdAt}`}
            item={item}
          />
        )}
        ListEmptyComponent={<NoNotifications />}
      />
    </ScrollView>
  );
};

const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => {
  return (
    <View
      style={{
        display: "flex",
        padding: layout.spacing_x2,
        borderWidth: 1,
        borderRadius: layout.borderRadius,
        borderColor: neutral44,
        marginBottom: layout.spacing_x1_5,
      }}
    >
      <View
        style={{
          flex: 6,
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <UserNameInline
            userId={item.triggerBy || ""}
            size="S"
            style={{ width: "100%" }}
          />
        </View>

        <View style={{ flex: 4, marginHorizontal: layout.spacing_x1 }}>
          <OmniLink
            to={{
              screen: "FeedPostView",
              params: { id: item.action },
            }}
          >
            <View>
              <BrandText style={fontSemibold14}>
                {useBuildBodyText(item)}
              </BrandText>
              <View
                style={{
                  marginTop: layout.spacing_x1,
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  justifyContent: "space-between",
                }}
              >
                <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                  {moment.unix(item.createdAt).fromNow()}
                </BrandText>
              </View>
            </View>
          </OmniLink>
        </View>
        <View
          style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}
        >
          <BrandText
            style={[
              {
                backgroundColor: resolveColor("backgroundColor", item.category),
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 32,
                height: 25,
                color: resolveColor("color", item.category),
                paddingTop: 4,
                paddingRight: 8,
                paddingBottom: 4,
                paddingLeft: 8,
                textTransform: "capitalize",
              },
              fontBold12,
            ]}
          >
            {item.category}
          </BrandText>
        </View>
      </View>
    </View>
  );
};
const NoNotifications: React.FC = () => (
  <View
    style={{
      alignSelf: "center",
      padding: layout.spacing_x3,
    }}
  >
    <BrandText>Follow more Teritorians</BrandText>
  </View>
);

const getPrettyPrice = (item: Notification): string => {
  const values = item.body.split(":");

  return prettyPrice(values[0], values[1], values[2]);
};

const useBuildBodyText = (item: Notification) => {
  const triggerBy = useNSUserInfo(item.triggerBy);
  const triggerByName =
    triggerBy?.metadata?.tokenId || tinyAddress(item.triggerBy, 30) || "";
  const userInfo = useNSUserInfo(item.userId);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(item.userId, 30) || "";

  if (item.category === "reaction") {
    return `${triggerByName} ${item.body} ${name}'s post.`;
  }
  if (item.category === "comment") {
    return `${triggerByName} commented ${name}'s post.`;
  }
  if (item.category === "tip") {
    return `💸 ${triggerByName} TIP ${getPrettyPrice(item)} ${name}'s post.`;
  }
  if (item.category === "nft-transfer") {
    return `${triggerByName} transfer an NFT to ${name}`;
  }
  if (item.category === "mint") {
    return `🤑 ${name}'s newly minted NFT is here.`;
  }
  if (item.category === "mint-tns") {
    const tnsTokenId = item.body.split(":");
    return `🎉 ${name} on minted ${tnsTokenId[0]}`;
  }
  if (item.category === "nft-trade-buyer") {
    return `${name}'s NFT was sold for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "nft-trade-seller") {
    return `${triggerByName} bought ${name}'s nft for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "dao-member-added") {
    return `${triggerByName} added ${name} to their organization`;
  }
  if (item.category === "dao-member-deleted") {
    return `${triggerByName} removed ${name} from their organization`;
  }
  if (item.category === "dao-proposal-created") {
    return `${triggerByName} has new proposals to vote.`;
  }
  if (item.category === "p2e-riot-squad-staking") {
    return `${name} R!OT fight ${
      moment.unix(item.createdAt).isBefore(moment.now())
        ? `has finished ${moment.unix(item.createdAt).fromNow()}`
        : `will finish in ${moment.unix(item.createdAt).fromNow()}`
    }`;
  }
};

const resolveColor = (type: "backgroundColor" | "color", category: string) => {
  switch (type) {
    case "backgroundColor":
      return category.includes("nft")
        ? "rgba(22, 187, 255, 0.16)"
        : category.includes("dao")
          ? purpleDark
          : neutral33;
    case "color":
      return category.includes("nft")
        ? "white"
        : category.includes("dao")
          ? yellowDefault
          : secondaryColor;
  }
};
