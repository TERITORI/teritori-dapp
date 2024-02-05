import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import {
  ContactSelectionType,
  NewConversationOrGroupSelector,
} from "./components/NewConversationOrGroupSelector";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { SpacerColumn } from "../../../components/spacer";
import { selectConversationList } from "../../../store/slices/message";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  getConversationAvatar,
  getConversationName,
} from "../../../weshnet/messageHelpers";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export const NewGroupScreen: ScreenFC<"MiniNewGroup"> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const conversations = useSelector(selectConversationList);

  const usersList = conversations.reduce((acc, conversation) => {
    if (conversation) {
      acc.push({
        id: conversation.id,
        avatar: conversation?.members.map((_, index) =>
          getConversationAvatar(conversation, index),
        ),
        name: getConversationName(conversation),
      });
    }
    return acc;
  }, [] as ContactSelectionType[]);

  return (
    <BlurScreenContainer title="New group">
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
          inputStyle={[fontMedium14]}
          placeholderTextColor={neutralA3}
        />
        <SpacerColumn size={2} />
        <NewConversationOrGroupSelector
          contacts={usersList}
          isGroupSelector
          onPressContact={({ id }) =>
            navigation.replace("Conversation", { conversationId: id })
          }
          onCreateGroup={(selectedContactsGroup) => {
            alert(JSON.stringify(selectedContactsGroup));
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};
