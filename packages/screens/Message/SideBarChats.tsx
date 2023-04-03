import React from "react";
import { View, Text } from "react-native";

import ConversationData from "../../components/sidebarchat/ConversationData";
import Searchbar from "../../components/sidebarchat/Searchbar";
import SideBarChatConversation from "../../components/sidebarchat/SideBarChatConversation";
const SideBarChats = () => {
  return (
    <View>
      <Searchbar />
      {ConversationData.map((item) => (
        <SideBarChatConversation
          avatar={item.avatar}
          name={item.name}
          isOnline={item.isOnline}
          chat={item.chat}
        />
      ))}
    </View>
  );
};
export default SideBarChats;
