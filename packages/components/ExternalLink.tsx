import React from "react";
import { TextStyle, TouchableOpacity, Linking } from "react-native";

import { primaryColor } from "../utils/colors";
import { BrandText } from "./BrandText";

export const ExternalLink: React.FC<{
  externalUrl: string;
  style?: TextStyle;
}> = ({ children, externalUrl, style }) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(externalUrl)}>
      <BrandText
        style={[
          {
            // @ts-ignore
            textDecoration: "underline",
            // TODO: color gradient blue
            color: primaryColor,
          },
          style,
        ]}
      >
        <>{children}</>
      </BrandText>
    </TouchableOpacity>
  );
};
