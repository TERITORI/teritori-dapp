import React, { useState } from "react";
import { SafeAreaView, View } from "react-native";

import { NewConversationOrGroupSelector } from "./components/NewConversationOrGroupSelector";
import { SearchChatList } from "./components/SearchChatList";
import closeSVG from "../../../../assets/icons/close.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { ScreenFC } from "../../../utils/navigation";
import { fontSemibold18 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

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

  const onClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(0, 0, 0,0.95)",
        position: "relative",
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <BrandText style={[fontSemibold18]}>New Group</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>
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
    </SafeAreaView>
  );
};
