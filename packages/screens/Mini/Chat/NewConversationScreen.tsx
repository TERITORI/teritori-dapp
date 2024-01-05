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
          <BrandText style={[fontSemibold18]}>New conversation</BrandText>

          <CustomPressable onPress={onClose} style={{}}>
            <SVG source={closeSVG} height={28} width={28} />
          </CustomPressable>
        </View>
        <SearchChatList
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
          onPressContact={({ id }) =>
            navigation.replace("Conversation", { conversationId: id })
          }
        />
      </View>
    </SafeAreaView>
  );
};
