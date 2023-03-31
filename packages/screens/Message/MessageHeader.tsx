import React from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";

interface MessageHeaderProps {}

export const MessageHeader: React.FC<MessageHeaderProps> = () => {
  return (
    <View>
      <BrandText
        style={{
          fontSize: 20,
        }}
      >
        Messenger home
      </BrandText>
    </View>
  );
};
