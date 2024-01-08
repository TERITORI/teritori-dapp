import React from "react";
import { View } from "react-native";

import { SettingBase } from "./components/SettingBase";
import chevronGrayRightSVG from "../../../../assets/icons/chevron-right-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import {
  RouteName,
  ScreenFC,
  useAppNavigation,
} from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

export const SettingsScreen: ScreenFC<"MiniSettings"> = ({ navigation }) => {
  return (
    <SettingBase
      title="Settings"
      onGoBack={() => navigation.replace("MiniProfile")}
    >
      <SettingMenuItem title="Connected Apps" navigateTo="MiniSettings" />
      <SettingMenuItem title="Address Book" navigateTo="MiniSettings" />
      <SettingMenuItem title="Change Network" navigateTo="MiniSettings" />
      <SettingMenuItem title="Security & Privacy" navigateTo="MiniSettings" />
      <SettingMenuItem title="Chat Settings" navigateTo="MiniChatSetting" />
      <SettingMenuItem title="About Teritori" navigateTo="MiniSettings" />
    </SettingBase>
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
