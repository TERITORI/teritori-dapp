import moment from "moment/moment";
import React, { useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { BellIcon } from "react-native-heroicons/outline";
import { XMarkIcon } from "react-native-heroicons/solid";

import { TOP_MENU_BUTTON_HEIGHT } from "./TopMenu";
import {
  DismissNotificationsRequest,
  Notification,
  NotificationsRequest,
} from "../../api/notification/v1/notification";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useNotifications } from "../../hooks/useNotifications";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseNetworkObjectId } from "../../networks";
import { mustGetNotificationClient } from "../../utils/backend";
import {
  neutral00,
  neutral33,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { headerHeight, layout, topMenuWidth } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { UserNameInline } from "../UserNameInline";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const NotificationDrawer: React.FC = () => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();

  const dropdownRef = useRef<View>(null);

  return (
    <View ref={dropdownRef}>
      <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
        <TertiaryBox
          width={50}
          style={{
            marginRight: layout.spacing_x1_5,
          }}
          mainContainerStyle={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
            backgroundColor: isDropdownOpen(dropdownRef)
              ? neutral33
              : neutral00,
          }}
          height={TOP_MENU_BUTTON_HEIGHT}
        >
          <BellIcon
            color={isDropdownOpen(dropdownRef) ? primaryColor : secondaryColor}
          />
        </TertiaryBox>
      </TouchableOpacity>

      <NotificationList
        style={[
          {
            position: "absolute",
            top: 46,
            right: 0,
          },
          !isDropdownOpen(dropdownRef) && { display: "none" },
        ]}
      />
    </View>
  );
};

const NotificationList: React.FC<{ style: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const notifications = useNotifications({
    userId: selectedWallet?.userId,
  });

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
          ListHeaderComponent={
            // @ts-ignore
            notifications?.length > 0 ? <Controls /> : null
          }
          ListEmptyComponent={<NoNotifications />}
        />
      </ScrollView>
    </TertiaryBox>
  );
};

const DismissNotificationButton: React.FC<{
  id: number;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, setVisible }) => {
  const selectedWallet = useSelectedWallet();

  return (
    <TouchableOpacity
      onPress={() => {
        setVisible(false);
        clearNotification({
          userId: selectedWallet?.userId,
          notificationId: id,
        });
      }}
    >
      <XMarkIcon
        // @ts-ignore
        style={{
          justifyContent: "flex-end",
          alignSelf: "flex-end",
          fill: secondaryColor,
        }}
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
          <DismissNotificationButton id={item.id} setVisible={setVisible} />
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
        onPress={() => {
          clearAllNotifications({
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
};

export const clearAllNotifications = (req: Partial<NotificationsRequest>) => {
  (async () => {
    const networkId = parseNetworkObjectId(req?.userId);

    if (!networkId) {
      return [];
    }

    const notificationService = mustGetNotificationClient(networkId[0]?.id);
    const { ok } = await notificationService.DismissAllNotifications(req);
    return ok;
  })();
};

export const clearNotification = (
  req: Partial<DismissNotificationsRequest>
) => {
  (async () => {
    const networkId = parseNetworkObjectId(req?.userId);

    if (!networkId) {
      return [];
    }

    const notificationService = mustGetNotificationClient(networkId[0]?.id);
    const { ok } = await notificationService.DismissNotification(req);
    return ok;
  })();
};
