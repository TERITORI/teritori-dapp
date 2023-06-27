import React from "react";
import { Platform } from "react-native";

import { ChatSection } from "./ChatSection";
import { ScreenContainer } from "../../../components/ScreenContainer";

export const MessageGroupChat = (props) => {
  if (Platform.OS === "web") {
    return <ChatSection {...props} />;
  }
  return (
    <ScreenContainer noScroll>
      <ChatSection {...props} />
    </ScreenContainer>
  );
};
