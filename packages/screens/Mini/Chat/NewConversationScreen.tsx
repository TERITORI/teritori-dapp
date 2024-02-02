import React, { useState } from "react";
import { View } from "react-native";

import { NewConversationOrGroupSelector } from "./components/NewConversationOrGroupSelector";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

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
  const [search, setSearch] = useState("");

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
          inputStyle={[fontMedium14]}
        />
        <SpacerColumn size={2} />
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
