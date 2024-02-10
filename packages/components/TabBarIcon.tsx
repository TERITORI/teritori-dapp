import React from "react";
import { View } from "react-native";

import { SVG } from "./SVG";
import feedSVG from "../../assets/icons/bottomTab/feed.svg";
import walletSVG from "../../assets/icons/bottomTab/wallets.svg";

import ToggleButton from "@/components/buttons/ToggleButton";

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
    return <ToggleButton isActive />;
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
