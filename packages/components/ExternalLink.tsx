import React from "react";
import { TextStyle, TouchableOpacity, Linking } from "react-native";

import { primaryColor } from "../utils/colors";
import { BrandText } from "./BrandText";

export const ExternalLink: React.FC<{
  externalUrl: string;
  style?: TextStyle;
  numberOfLines?: number;
}> = ({ children, externalUrl, style, numberOfLines }) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(externalUrl)}>
      <BrandText
        numberOfLines={numberOfLines}
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
