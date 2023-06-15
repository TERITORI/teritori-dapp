import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useAppNavigation } from "../../utils/navigation";

export const ChatItem = ({ data, onPress }) => {
  const navigation = useAppNavigation();

  const { metadata } = useNSUserInfo(
    data?.payload?.contactMetadata?.tokenId || "sakul.tori"
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
        avatar={metadata.image}
        name={metadata.public_name || "Anon"}
        isOnline
        chat=""
        time={data?.payload?.contactMetadata?.timestamp}
        iconCheck
      />
    </TouchableOpacity>
  );
};
