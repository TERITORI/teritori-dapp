import React from "react";
import { GestureResponderEvent, Image, Pressable, View } from "react-native";

import NotificationSVG from "../../../assets/icons/notification-new.svg";
import { BrandText } from "../../components/BrandText";
import { AddChatDropdownMenu } from "../../screens/Mini/Chat/AddChatDropdownMenu";
import { neutral00, secondaryColor } from "../../utils/style/colors";
import { fontSemibold18 } from "../../utils/style/fonts";
import { layout, MOBILE_HEADER_HEIGHT } from "../../utils/style/layout";
interface HeaderMiniProps {
  title: string;
  onPressNotification?: (event: GestureResponderEvent) => void;
  onPressAdd?: (event: GestureResponderEvent) => void;
}

export const HeaderMini = ({
  title,
  onPressNotification = () => {},
  onPressAdd = () => {},
}: HeaderMiniProps) => {
  return (
    <View
      style={{
        backgroundColor: neutral00,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: layout.spacing_x1_5,
        height: MOBILE_HEADER_HEIGHT,
        maxHeight: MOBILE_HEADER_HEIGHT,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: layout.spacing_x1_5,
        position: "absolute",
        top: 0,
        zIndex: 99999,
      }}
    >
      <Image
        source={{ uri: "https://picsum.photos/200" }}
        style={{ height: 32, width: 32, borderRadius: 16 }}
      />
      <BrandText
        style={[
          fontSemibold18,
          {
            color: secondaryColor,
            flex: 1,
            textAlign: "center",
            transform: [{ translateX: 30 }],
          },
        ]}
      >
        {title}
      </BrandText>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={onPressNotification}
          style={{ paddingHorizontal: layout.spacing_x2 }}
        >
          <NotificationSVG />
        </Pressable>
        <AddChatDropdownMenu />
      </View>
    </View>
  );
};
