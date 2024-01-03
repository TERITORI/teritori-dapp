import React from "react";
import { Switch, View } from "react-native";

import { SVG } from "./SVG";
import feedSVG from "../../assets/icons/bottomTab/feed.svg";
import walletSVG from "../../assets/icons/bottomTab/wallets.svg";
import {
  blueDefault,
  neutral33,
  neutral99,
  secondaryColor,
} from "../utils/style/colors";

const icons = {
  MiniChats: "",
  MiniFeeds: feedSVG,
  MiniWallets: walletSVG,
};

interface TabBarIconProps {
  size: number;
  color: string;
  title: string;
  focused: boolean;
}

export const TabBarIcon = ({
  color,
  title,
  focused,
  size,
}: TabBarIconProps) => {
  if (title === "MiniChats") {
    return (
      <Switch
        trackColor={{ false: neutral33, true: blueDefault }}
        thumbColor={!focused ? neutral99 : secondaryColor}
        ios_backgroundColor={focused ? blueDefault : neutral33}
        value={focused}
      />
    );
  }
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SVG
        source={icons[title as keyof typeof icons]}
        height={size}
        width={size}
        fill={color}
      />
    </View>
  );
};
