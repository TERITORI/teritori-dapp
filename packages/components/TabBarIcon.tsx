import { View } from "react-native";
import { useSelector } from "react-redux";

import { SVG } from "./SVG";
import feedSVG from "../../assets/icons/bottomTab/feed.svg";
import walletSVG from "../../assets/icons/bottomTab/wallets.svg";
import messageSVG from "../../assets/icons/message.svg";

import ToggleButton from "@/components/buttons/ToggleButton";
import {
  selectIsChatActivated,
  setIsChatActivated,
  selectIsForceChatActivated,
} from "@/store/slices/message";
import { store } from "@/store/store";
import { checkAndBootWeshModule, stopWeshModule } from "@/weshnet/services";

const icons = {
  MiniChats: messageSVG,
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
  const isForceChatActivated = useSelector(selectIsForceChatActivated);

  function toggleChat(value: boolean) {
    store.dispatch(setIsChatActivated(value));
    if (value) {
      checkAndBootWeshModule();
    } else {
      stopWeshModule();
    }
  }

  if (title === "MiniChats" && !isForceChatActivated) {
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
