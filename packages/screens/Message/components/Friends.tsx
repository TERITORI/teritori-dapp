import React, { useState } from "react";
import { View, ScrollView } from "react-native";

import nullIcon from "../../../assets/icons/illustration.svg";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { MessageBlankFiller } from "../../../components/blankFiller/MessageBlankFiller";
import FriendList from "../../../components/friends/FriendsList";
import { TextInputCustomBorder } from "../../../components/inputs/TextInputCustomBorder";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00, neutral33 } from "../../../utils/style/colors";
import { Conversation, ConversationList } from "../../../utils/types/message";
interface FriendsProps {
  items: Conversation[];
  setActiveConversation: () => void;
}
export const Friends = ({ items, setActiveConversation }: FriendsProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      <TextInputCustomBorder
        placeHolder="Search..."
        style={{ backgroundColor: neutral00 }}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SpacerColumn size={2} />

      <SpacerColumn size={1} />
      {filteredItems?.length > 0 ? (
        filteredItems?.map((item) => (
          <FriendList
            key={item.id}
            item={item}
            handleChatPress={() => {
              setActiveConversation(item);
            }}
          />
        ))
      ) : (
        <MessageBlankFiller />
      )}
    </View>
  );
};
