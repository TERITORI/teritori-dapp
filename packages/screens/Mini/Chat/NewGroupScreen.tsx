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
    id: "2",
    name: "Albert",
    avatar: "",
  },
  {
    id: "3",
    name: "Digger",
    avatar: "",
  },
  {
    id: "4",
    name: "Bayo",
    avatar: "",
  },
  {
    id: "5",
    name: "David",
    avatar: "",
  },
  {
    id: "6",
    name: "Eddie",
    avatar: "",
  },
  {
    id: "7",
    name: "Eva",
    avatar: "",
  },
  {
    id: "8",
    name: "Digger",
    avatar: "",
  },
  {
    id: "9",
    name: "Bold",
    avatar: "",
  },
  {
    id: "10",
    name: "Arnold",
    avatar: "",
  },
  {
    id: "11",
    name: "Albert",
    avatar: "",
  },
  {
    id: "12",
    name: "Bayo",
    avatar: "",
  },
  {
    id: "13",
    name: "David",
    avatar: "",
  },
  {
    id: "14",
    name: "Eddie",
    avatar: "",
  },
  {
    id: "15",
    name: "Eva",
    avatar: "",
  },
  {
    id: "16",
    name: "Digger",
    avatar: "",
  },
  {
    id: "17",
    name: "Bold",
    avatar: "",
  },
  {
    id: "18",
    name: "Arnold",
    avatar: "",
  },
  {
    id: "19",
    name: "David",
    avatar: "",
  },
  {
    id: "20",
    name: "Eddie",
    avatar: "",
  },

  {
    id: "21",
    name: "Digger",
    avatar: "",
  },
];

export const NewGroupScreen: ScreenFC<"MiniNewGroup"> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { height: windowHeight } = useWindowDimensions();

  return (
    <BlurScreenContainer
      title="New group "
      background="transparent"
      reverseView={false}
    >
      <View
        style={{
          height: windowHeight - 150,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <SearchChatList
          placeholder="Search by nickname"
          setValue={setSearch}
          value={search}
          style={{
            backgroundColor: "rgba(118, 118, 128, 0.24)",
            padding: 10,
            borderRadius: 10,
            marginVertical: layout.spacing_x2_5,
          }}
        />
        <NewConversationOrGroupSelector
          contacts={dummyContact}
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
