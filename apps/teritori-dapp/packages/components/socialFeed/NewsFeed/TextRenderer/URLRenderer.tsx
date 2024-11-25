import React from "react";
import { Linking, Text, TouchableOpacity } from "react-native";

import { primaryColor } from "../../../../utils/style/colors";

const handleLinkPress = (text: string) => {
  let linkText = text;
  if (linkText[0] === "@") {
    linkText = linkText.substring(1);
  }
  if (linkText.startsWith("www")) {
    linkText = `https://${linkText}`;
  }

  Linking.openURL(linkText);
};

export const URLRenderer: React.FC<{ text: string }> = ({ text }) => {
  return (
    <TouchableOpacity onPress={() => handleLinkPress(text)}>
      <Text style={{ color: primaryColor }}>{text}</Text>
    </TouchableOpacity>
  );
};
