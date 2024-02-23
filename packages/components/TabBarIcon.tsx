import { useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { SVG } from "./SVG";
import feedSVG from "../../assets/icons/bottomTab/feed.svg";
import walletSVG from "../../assets/icons/bottomTab/wallets.svg";

import ToggleButton from "@/components/buttons/ToggleButton";
import {
  selectIsChatActivated,
  setIsChatActivated,
} from "@/store/slices/settings";
import { store } from "@/store/store";
import { checkAndBootWeshModule, stopWeshModule } from "@/weshnet/services";

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
  const isChatActivated = useSelector(selectIsChatActivated);

  useEffect(() => {
    if (isChatActivated) {
      checkAndBootWeshModule();
    } else {
      stopWeshModule();
    }
  }, [isChatActivated]);

  function toggleChat(value: boolean) {
    store.dispatch(setIsChatActivated(value));
  }

  if (title === "MiniChats") {
    return (
      <ToggleButton isActive={isChatActivated} onValueChange={toggleChat} />
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
