import { QueryClient, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { BellAlertIcon, BellIcon } from "react-native-heroicons/outline";
import { XMarkIcon } from "react-native-heroicons/solid";

import { TOP_MENU_BUTTON_HEIGHT } from "./TopMenu";
import {
  DismissNotificationRequest,
  Notification,
  NotificationsRequest,
} from "../../api/notification/v1/notification";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import {
  notificationsQueryKey,
  useNotifications,
} from "../../hooks/useNotifications";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseUserId } from "../../networks";
import { mustGetNotificationClient } from "../../utils/backend";
import { prettyPrice } from "../../utils/coins";
import {
  neutral00,
  neutral33,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold14,
  fontSemibold8,
} from "../../utils/style/fonts";
import { headerHeight, layout, topMenuWidth } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink, OmniLinkToType } from "../OmniLink";
import { UserNameInline } from "../UserNameInline";
import { TertiaryBox } from "../boxes/TertiaryBox";

import { LegacyTertiaryBox } from "@/components/boxes/LegacyTertiaryBox";
import { useDropdowns } from "@/hooks/useDropdowns";

export const NotificationDrawer: React.FC = () => {
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();

  const selectedWallet = useSelectedWallet();
  const notifications = useNotifications({
    userId: selectedWallet?.userId,
  });

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => setDropdownState(!isDropdownOpen)}>
        <LegacyTertiaryBox
          width={50}
          style={{
            marginRight: layout.spacing_x1_5,
          }}
          mainContainerStyle={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: isDropdownOpen ? neutral33 : neutral00,
          }}
          height={TOP_MENU_BUTTON_HEIGHT}
        >
          {notifications && notifications.length > 0 ? (
            <>
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 4,
                  borderRadius: 9999,
                  width: 8,
                  height: 8,
                  backgroundColor: primaryColor,
                }}
              >
                <BrandText
                  style={[
                    fontSemibold8,
                    {
                      position: "absolute",
                      right: 2.3,
                    },
                  ]}
                >
                  {notifications.length > 9 ? "♾️" : notifications.length}
                </BrandText>
              </View>
              <BellAlertIcon
                color={isDropdownOpen ? primaryColor : secondaryColor}
              />
            </>
          ) : (
            <BellIcon color={isDropdownOpen ? primaryColor : secondaryColor} />
          )}
        </LegacyTertiaryBox>
      </TouchableOpacity>

      <NotificationList
        notifications={notifications}
        style={[
          {
            position: "absolute",
            top: 46,
            right: 0,
          },
          !isDropdownOpen && { display: "none" },
        ]}
      />
    </View>
  );
};

const NotificationList: React.FC<{
  style: StyleProp<ViewStyle>;
  notifications: Notification[] | undefined;
}> = ({ style, notifications }) => {
  const { height: windowHeight } = useWindowDimensions();

  return (
    <TertiaryBox
      width={topMenuWidth}
      noBrokenCorners
      style={[style, { borderRadius: 8 }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          height: "100%",
          width: topMenuWidth - 2,
          maxHeight: windowHeight - headerHeight / 2 - TOP_MENU_BUTTON_HEIGHT,
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
          ListHeaderComponent={notifications?.length ? <Controls /> : null}
          ListEmptyComponent={<NoNotifications />}
        />
      </ScrollView>
    </TertiaryBox>
  );
};

const DismissNotificationButton: React.FC<{
  id: number;
  onPress?: () => void;
}> = ({ id, onPress }) => {
  const selectedWallet = useSelectedWallet();
  const queryClient = useQueryClient();

  return (
    <TouchableOpacity
      onPress={async () => {
        onPress?.();
        await clearNotification(queryClient, {
          userId: selectedWallet?.userId,
          notificationId: id,
        });
      }}
    >
      <XMarkIcon
        style={{
          justifyContent: "flex-end",
          alignSelf: "flex-end",
        }}
        fill={secondaryColor}
      />
    </TouchableOpacity>
  );
};

const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => {
  const [visible, setVisible] = useState(true);

  return (
    <View
      style={{
        display: visible ? "flex" : "none",
        padding: layout.spacing_x1,
        borderBottomWidth: 1,
        borderBottomColor: neutral44,
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
            showText={false}
            size="S"
            style={{ width: "100%" }}
          />
        </View>

        <View style={{ flex: 4, marginHorizontal: layout.spacing_x1 }}>
          <OmniLink to={getOmniLink(item)}>
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
                <BrandText style={fontSemibold12}>
                  {moment.unix(item.createdAt).fromNow()}
                </BrandText>
                <BrandText
                  style={[
                    fontSemibold12,
                    {
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  {item.category}
                </BrandText>
              </View>
            </View>
          </OmniLink>
        </View>

        <View
          style={{
            flex: 0.5,
            zIndex: 2,
            justifyContent: "flex-end",
            alignSelf: "center",
          }}
        >
          <DismissNotificationButton
            id={item.id}
            onPress={() => setVisible(false)}
          />
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
    <BrandText>No new Notifications 🥺</BrandText>
  </View>
);

const Controls: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const queryClient = useQueryClient();

  return (
    <View
      style={{
        padding: layout.spacing_x1,
        borderBottomWidth: 1,
        width: "100%",
        borderBottomColor: neutral44,
      }}
    >
      <TouchableOpacity
        style={{
          alignSelf: "flex-end",
        }}
        onPress={async () => {
          await clearAllNotifications(queryClient, {
            userId: selectedWallet?.userId,
          });
        }}
      >
        <BrandText style={fontSemibold14}>Clear All</BrandText>
      </TouchableOpacity>
    </View>
  );
};

const useBuildBodyText = (item: Notification) => {
  const userInfo = useNSUserInfo(item.triggerBy);
  const name =
    userInfo?.metadata?.tokenId || tinyAddress(item.triggerBy, 30) || "";

  if (item.category === "reaction") {
    return `${name} ${item.body} your post.`;
  }
  if (item.category === "comment") {
    return `${name} commented your post.`;
  }
  if (item.category === "tip") {
    return `💸 ${name} TIP ${getPrettyPrice(item)} your post.`;
  }
  if (item.category === "nft-transfer") {
    return `${name} transfer an NFT.`;
  }
  if (item.category === "mint") {
    return `🤑 Your newly minted NFT is here.`;
  }
  if (item.category === "mint-tns") {
    const tnsTokenId = item.body.split(":");
    return `🎉 on minting ${tnsTokenId[0]}`;
  }
  if (item.category === "nft-trade-buyer") {
    return `Your NFT was sold for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "nft-trade-seller") {
    return `${name} bought your nft for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "dao-member-added") {
    return `${name} added to their organization`;
  }
  if (item.category === "dao-member-deleted") {
    return `${name} removed you from their organization`;
  }
  if (item.category === "dao-proposal-created") {
    return `${name} has new proposals to vote.`;
  }
  if (item.category === "p2e-riot-squad-staking") {
    return `Your R!OT fight ${
      moment.unix(item.createdAt).isBefore(moment.now())
        ? `has finished ${moment.unix(item.createdAt).fromNow()}`
        : `will finish in ${moment.unix(item.createdAt).fromNow()}`
    }`;
  }
};

const getOmniLink = (item: Notification): OmniLinkToType => {
  if (["reaction", "comment", "tip"].includes(item.category)) {
    return {
      screen: "FeedPostView",
      params: { id: item.action },
    };
  }
  if (
    [
      "nft-trade-seller",
      "nft-trade-buyer",
      "nft-transfer",
      "mint",
      "mint-tns",
    ].includes(item.category)
  ) {
    return {
      screen: "NFTDetail",
      params: { id: item.action },
    };
  }
  if (["p2e-riot-squad-staking"].includes(item.category)) {
    return {
      screen: "RiotGame",
    };
  }
  if (
    ["dao-member-removed", "dao-member-added", "dao-proposal-created"].includes(
      item.category,
    )
  ) {
    return {
      screen: "UserPublicProfile",
      params: { id: item.action },
    };
  }
  return {
    screen: "Home",
  };
};

const getPrettyPrice = (item: Notification): string => {
  const values = item.body.split(":");

  return prettyPrice(values[0], values[1], values[2]);
};

const clearAllNotifications = async (
  queryClient: QueryClient,
  req: Partial<NotificationsRequest>,
) => {
  const [network] = parseUserId(req?.userId);

  if (!network) {
    return false;
  }

  const notificationService = mustGetNotificationClient(network.id);
  await notificationService.DismissAllNotifications(req);
  await queryClient.invalidateQueries(notificationsQueryKey(req?.userId));
};

const clearNotification = async (
  queryClient: QueryClient,
  req: Partial<DismissNotificationRequest>,
) => {
  const [network] = parseUserId(req?.userId);

  if (!network) {
    return false;
  }

  const notificationService = mustGetNotificationClient(network.id);
  await notificationService.DismissNotification(req);
  await queryClient.invalidateQueries(notificationsQueryKey(req?.userId));
};
