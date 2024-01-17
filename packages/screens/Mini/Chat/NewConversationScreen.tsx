import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import { NewConversationOrGroupSelector } from "./components/NewConversationOrGroupSelector";
import { SearchChatList } from "./components/SearchChatList";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";

const dummyContact = [
  {
    id: "1",
    name: "Eva",
    avatar: "",
  },
  {
    id: "1",
    name: "Albert",
    avatar: "",
  },
  {
    id: "1",
    name: "Digger",
    avatar: "",
  },
  {
    id: "1",
    name: "Bayo",
    avatar: "",
  },
  {
    id: "1",
    name: "David",
    avatar: "",
  },
  {
    id: "1",
    name: "Eddie",
    avatar: "",
  },
  {
    id: "1",
    name: "Eva",
    avatar: "",
  },
  {
    id: "1",
    name: "Digger",
    avatar: "",
  },
  {
    id: "1",
    name: "Bold",
    avatar: "",
  },
  {
    id: "1",
    name: "Arnold",
    avatar: "",
  },
  {
    id: "1",
    name: "Albert",
    avatar: "",
  },
  {
    id: "1",
    name: "Bayo",
    avatar: "",
  },
  {
    id: "1",
    name: "David",
    avatar: "",
  },
  {
    id: "1",
    name: "Eddie",
    avatar: "",
  },
  {
    id: "1",
    name: "Eva",
    avatar: "",
  },
  {
    id: "1",
    name: "Digger",
    avatar: "",
  },
  {
    id: "1",
    name: "Bold",
    avatar: "",
  },
  {
    id: "1",
    name: "Arnold",
    avatar: "",
  },
  {
    id: "1",
    name: "David",
    avatar: "",
  },
  {
    id: "1",
    name: "Eddie",
    avatar: "",
  },

  {
    id: "1",
    name: "Digger",
    avatar: "",
  },
];

export const NewConversationScreen: ScreenFC<"MiniNewConversation"> = ({
  navigation,
}) => {
  const { height: windowHeight } = useWindowDimensions();

  const [search, setSearch] = useState("");

  return (
    <BlurScreenContainer
      title="New conversation"
      background="transparent"
      reverseView={false}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          height: windowHeight - 150,
        }}
      >
        <SearchChatList
          setValue={setSearch}
          value={search}
          placeholder="Search by nickname"
          style={{
            backgroundColor: "rgba(118, 118, 128, 0.24)",
            padding: 10,
            borderRadius: 10,
            marginVertical: layout.spacing_x2_5,
          }}
        />
        <NewConversationOrGroupSelector
          contacts={dummyContact}
          onPressContact={({ id }) =>
            navigation.replace("Conversation", { conversationId: id })
          }
        />
      </View>
    </BlurScreenContainer>
  );
};
