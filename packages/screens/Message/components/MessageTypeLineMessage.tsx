import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold10 } from "../../../utils/style/fonts";
import { Message } from "../../../utils/types/message";

export const MessageTypeLineMessage = ({ message }: { message: Message }) => {
  if (message.type === "accept-contact") {
    return (
      <View style={{ alignItems: "center" }}>
        <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
          Contact accepted
        </BrandText>
      </View>
    );
  }
};
