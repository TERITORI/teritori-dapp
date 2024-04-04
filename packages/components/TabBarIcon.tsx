import { View } from "react-native";
import { useSelector } from "react-redux";

import { SVG } from "./SVG";
import feedSVG from "../../assets/icons/bottomTab/feed.svg";
import walletSVG from "../../assets/icons/bottomTab/wallets.svg";
import messageSVG from "../../assets/icons/message.svg";

import ToggleButton from "@/components/buttons/ToggleButton";
import { useCurrentRouteName } from "@/hooks/useCurrentRouteName";
import {
  selectContactInfo,
  selectIsChatActivated,
  selectIsForceChatActivated,
  selectIsWeshConnected,
  setContactInfo,
} from "@/store/slices/message";
import { useAppDispatch } from "@/store/store";
import {
  checkAndBootWeshModule,
  createSharableLink,
  stopWeshModule,
} from "@/weshnet/services";

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

export const TabBarIcon = ({ color, title, size }: TabBarIconProps) => {
  const isChatActivated = useSelector(selectIsChatActivated);
  const isForceChatActivated = useSelector(selectIsForceChatActivated);
  const currentRouteName = useCurrentRouteName();
  const contactInfo = useSelector(selectContactInfo);
  const isWeshConnected = useSelector(selectIsWeshConnected);
  const dispatch = useAppDispatch();

  function toggleChat(value: boolean) {
    if (value) {
      // to check if wesh is connected creating a shareable link and if it didn't get created then it is not connected
      const shareLink = createSharableLink({
        ...contactInfo,
      });
      dispatch(
        setContactInfo({
          shareLink,
        }),
      );
      checkAndBootWeshModule();
    } else {
      stopWeshModule();
    }
  }

  if (title === "MiniChats" && !isForceChatActivated) {
    return (
      <ToggleButton
        isActive={isChatActivated}
        onValueChange={toggleChat}
        disabled={
          currentRouteName !== "MiniChats" ||
          (isChatActivated && !contactInfo.shareLink) ||
          (isChatActivated && !isWeshConnected)
        }
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
