import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
type ConversationType = {
  date: string;
  message: string;
};

type Props = {
  conversations: ConversationType[];
};

export const Conversations = (props: Props) => {
  return (
    <View>
      <BrandText>Conversations</BrandText>
    </View>
  );
};
