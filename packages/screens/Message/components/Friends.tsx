import React, { useState } from "react";
import { View } from "react-native";

import { MessageBlankFiller } from "../../../components/blankFiller/MessageBlankFiller";
import FriendList from "../../../components/friends/FriendsList";
import { TextInputCustomBorder } from "../../../components/inputs/TextInputCustomBorder";
import { SpacerColumn } from "../../../components/spacer";
import { neutral00 } from "../../../utils/style/colors";
import { Conversation } from "../../../utils/types/message";
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
