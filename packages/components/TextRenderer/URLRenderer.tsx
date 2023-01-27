import React from "react";
import { Linking, Text } from "react-native";

import { primaryColor } from "../../utils/style/colors";

export const UrlRender = ({ text }: { text: string }) => {
  return (
    <Text
      style={{ color: primaryColor, cursor: "pointer" }}
      onClick={() => {
        let linkText = text;
        if (linkText[0] === "@") {
          linkText = linkText.substring(1);
        }
        if (linkText.startsWith("www")) {
          linkText = `https://${linkText}`;
        }

        Linking.openURL(linkText);
      }}
    >
      {text}
    </Text>
  );
};
