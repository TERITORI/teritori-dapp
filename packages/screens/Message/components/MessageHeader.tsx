import React from "react";

import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { secondaryColor } from "@/utils/style/colors";

interface MessageHeaderProps {}

export const MessageHeader: React.FC<MessageHeaderProps> = () => {
  return (
    <ScreenTitle style={{ color: secondaryColor }}>Messenger home</ScreenTitle>
  );
};
