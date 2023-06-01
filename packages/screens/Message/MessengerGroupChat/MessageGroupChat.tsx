import React from "react";
import { Platform } from "react-native";

import { ChatSection } from "./ChatSection";
import { ScreenContainer } from "../../../components/ScreenContainer";

export const MessageGroupChat = () => {
  if (Platform.OS === "web") {
    return <ChatSection />;
  }
  return (
    <ScreenContainer noScroll>
      <ChatSection />
    </ScreenContainer>
  );
};
