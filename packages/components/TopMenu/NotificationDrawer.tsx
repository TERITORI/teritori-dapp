import moment from "moment/moment";
import React, { useRef } from "react";
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

import { TOP_MENU_BUTTON_HEIGHT } from "./TopMenu";
import { Notification } from "../../api/notification/v1/notification";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useNotifications } from "../../hooks/useNotifications";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { prettyPrice } from "../../utils/coins";
import {
  neutral00,
  neutral33,
  neutral44,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontBold16, fontSemibold12 } from "../../utils/style/fonts";
import { headerHeight, layout, topMenuWidth } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { BrandText } from "../BrandText";
import { OmniLink, OmniLinkToType } from "../OmniLink";
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
          ListEmptyComponent={<NoNotifications />}
        />
      </ScrollView>
    </TertiaryBox>
  );
};

const NotificationItem: React.FC<{ item: Notification }> = ({ item }) => {
  return (
    <OmniLink
      to={getOmniLink(item)}
      style={{
        padding: layout.spacing_x1,
        borderBottomWidth: 1,
        borderBottomColor: neutral44,
      }}
    >
      <View
        style={{
          flex: 5,
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
        <View style={{ flex: 4 }}>
          <View>
            <BrandText style={fontBold16}>{useBuildBodyText(item)}</BrandText>
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
              <BrandText style={fontSemibold12}>{item.category}</BrandText>
            </View>
          </View>
        </View>
      </View>
    </OmniLink>
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
    return `${name} tip ${getPrettyPrice(item)} your post.`;
  }
  if (item.category === "nft-transfer") {
    return `${name} transfer an NFT.`;
  }
  if (item.category === "nft-trade-buyer") {
    return `Your NFT was sold for ${getPrettyPrice(item)}.`;
  }
  if (item.category === "nft-trade-seller") {
    return `${name} bought your nft for ${getPrettyPrice(item)}.`;
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
    ["nft-trade-seller", "nft-trade-buyer", "nft-transfer"].includes(
      item.category
    )
  ) {
    return {
      screen: "NFTDetail",
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
