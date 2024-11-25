import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import {
  ContactSelectionType,
  NewConversationOrGroupSelector,
} from "./components/NewConversationOrGroupSelector";
import searchSVG from "@/assets/icons/search-gray.svg";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { SpacerColumn } from "@/components/spacer";
import { selectConversationList } from "@/store/slices/message";
import { ScreenFC } from "@/utils/navigation";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  getConversationAvatar,
  getConversationName,
} from "@/weshnet/messageHelpers";

export const NewConversationScreen: ScreenFC<"MiniNewConversation"> = ({
  navigation,
}) => {
  const [search, setSearch] = useState("");
  const conversations = useSelector(selectConversationList);

  const usersList = conversations.reduce((acc, conversation) => {
    const name = getConversationName(conversation);
    if (conversation && conversation?.type === "contact") {
      const contactPk = conversation?.members?.[0].id;
      if (search) {
        if (name.toLowerCase().includes(search.toLowerCase())) {
          acc.push({
            id: contactPk,
            conversationId: conversation.id,
            avatar: conversation?.members.map((_, index) =>
              getConversationAvatar(conversation, index),
            ),
            name,
          });
        }

        return acc;
      }
      acc.push({
        id: contactPk,
        conversationId: conversation.id,
        avatar: conversation?.members.map((_, index) =>
          getConversationAvatar(conversation, index),
        ),
        name,
      });
    }
    return acc;
  }, [] as ContactSelectionType[]);

  return (
    <BlurScreenContainer title="New conversation">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <MiniTextInput
          onChangeText={setSearch}
          value={search}
          icon={searchSVG}
          placeholder="Search by nickname"
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium14, { lineHeight: 0 }]}
        />
        <SpacerColumn size={2} />
        <NewConversationOrGroupSelector
          contacts={usersList}
          onPressContact={({ id, conversationId }) => {
            if (conversationId) {
              navigation.replace("Conversation", { conversationId });
            }
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};
