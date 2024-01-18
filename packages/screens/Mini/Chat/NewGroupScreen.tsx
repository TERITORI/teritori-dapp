import React, { useState } from "react";
import { View } from "react-native";

import { NewConversationOrGroupSelector } from "./components/NewConversationOrGroupSelector";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { SpacerColumn } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import MiniTextInput from "../components/MiniTextInput";

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
