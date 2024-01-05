import React from "react";
import { SafeAreaView, View } from "react-native";

import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { BackButton } from "../../../components/navigation/components/BackButton";
import {
  RouteName,
  ScreenFC,
  useAppNavigation,
} from "../../../utils/navigation";
import { fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const SettingsScreen: ScreenFC<"MiniSettings"> = ({ navigation }) => {
  const onClose = () => navigation.goBack();
  const navigateToProfile = () => navigation.replace("MiniProfile");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, .9)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <BackButton type="chevron" onPress={navigateToProfile} />
          <BrandText style={[fontSemibold18]}>Settings</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View style={{ backgroundColor: "#000" }}>
            <SettingMenuItem title="Connected Apps" navigateTo="MiniSettings" />
            <SettingMenuItem title="Address Book" navigateTo="MiniSettings" />
            <SettingMenuItem title="Change Network" navigateTo="MiniSettings" />
            <SettingMenuItem
              title="Security & Privacy"
              navigateTo="MiniSettings"
            />
            <SettingMenuItem
              title="Chat Settings"
              navigateTo="MiniChatSetting"
            />
            <SettingMenuItem title="About Teritori" navigateTo="MiniSettings" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

type MenuItemProps = {
  title: string;
  navigateTo: RouteName;
};
const SettingMenuItem = ({ navigateTo, title }: MenuItemProps) => {
  const navigation = useAppNavigation();
  const onMenuItemPress = () => {
    navigation.replace(navigateTo);
  };
  return (
    <CustomPressable onPress={onMenuItemPress}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: layout.spacing_x2,
          marginBottom: layout.spacing_x1_5,
        }}
      >
        <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
          <BrandText>{title}</BrandText>
        </View>
        <SVG source={chevronGrayRightSVG} height={24} width={24} />
      </View>
    </CustomPressable>
  );
};
