import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral11 } from "../../utils/style/colors";
import { Conversation } from "../../utils/types/message";

interface ChatItemProps {
  data: Conversation;
  onPress: () => void;
  isActive: boolean;
}

export const ChatItem = ({ data, onPress, isActive }: ChatItemProps) => {
  const navigation = useAppNavigation();

  const { metadata } = useNSUserInfo(
    data.members?.[0]?.tokenId || "sakul.tori"
  );

  return (
    <TouchableOpacity
      onPress={() =>
        ["android", "ios"].includes(Platform.OS)
          ? navigation.navigate("ChatSection")
          : onPress()
      }
    >
      <SideBarChatConversation
        isActive={isActive}
        avatar={metadata.image}
        name={data.name || metadata.public_name || "Anon"}
        isOnline
        chat=""
        time=""
        iconCheck
      />
    </TouchableOpacity>
  );
};
