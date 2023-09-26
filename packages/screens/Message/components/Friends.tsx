import React, { useState } from "react";
import { View, Platform } from "react-native";

import FriendList from "./FriendsList";
import { MessageBlankFiller } from "./MessageBlankFiller";
import { TextInputCustomBorder } from "../../../components/inputs/TextInputCustomBorder";
import { SpacerColumn } from "../../../components/spacer";
import { useAppNavigation } from "../../../utils/navigation";
import { neutral00 } from "../../../utils/style/colors";
import { Conversation } from "../../../utils/types/message";
interface FriendsProps {
  items: Conversation[];
  setActiveConversation?: (item: Conversation) => void;
}
export const Friends = ({ items, setActiveConversation }: FriendsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useAppNavigation();

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
              if (Platform.OS === "web") {
                setActiveConversation?.(item);
                navigate("Message");
              } else {
                navigate("ChatSection", item);
              }
              setActiveConversation?.(item);
            }}
          />
        ))
      ) : (
        <MessageBlankFiller />
      )}
    </View>
  );
};
