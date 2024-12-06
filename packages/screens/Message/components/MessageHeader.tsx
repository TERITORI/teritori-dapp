import React from "react";

import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";

interface MessageHeaderProps {}

export const MessageHeader: React.FC<MessageHeaderProps> = () => {
  return <ScreenTitle>Messenger home</ScreenTitle>;
};
