import React from "react";
import { SafeAreaView, View } from "react-native";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Conversations } from "./Conversations";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";

const dummyMessage = [
  {
    id: "1",
    date: "4m",
    message: "1Hi Guys",
    isMyMessage: true,
    status: "Sent",
  },
  {
    id: "2",
    date: "3m",
    message:
      "2Let's start organization of the open Beta here! Some mates are waiting :)",
    isMyMessage: true,
    status: "Sent",
  },
  {
    id: "3",
    date: "1m",
    message: "3Hello! Let's get started.",
    isMyMessage: false,
    status: "Sent",
  },
  {
    id: "4",
    date: "4m",
    message: "4Hi Guys",
    isMyMessage: true,
    status: "Sent",
  },
  {
    id: "5",
    date: "3m",
    message:
      "5Let's start organization of the open Beta here! Some mates are waiting :)",
    isMyMessage: true,
    status: "Sent",
  },
  {
    id: "6",
    date: "1m",
    message: "6Hello! Let's get started.",
    isMyMessage: false,
    status: "Sent",
  },
  {
    id: "7",
    date: "4m",
    message: "7Hi Guys",
    isMyMessage: true,
    status: "Sent",
  },
];

export const ConversationScreeen: ScreenFC<"Conversation"> = ({
  navigation,
}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#000000",
      }}
    >
      <View style={{ paddingHorizontal: layout.spacing_x2, flex: 1 }}>
        <ChatHeader navigation={navigation} />
        <SpacerRow size={4} />
        <Conversations conversations={[...dummyMessage]} isTyping />
        <SpacerColumn size={1} />
        <ChatInput />
      </View>
    </SafeAreaView>
  );
};
