import React from "react";
import { TextStyle, TouchableOpacity, Linking, StyleProp } from "react-native";

import { primaryColor } from "../utils/style/colors";
import { BrandText } from "./BrandText";

export const ExternalLink: React.FC<{
  externalUrl: string | null | undefined;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}> = ({ children, externalUrl, style, numberOfLines }) => {
  if (!externalUrl) {
    return null;
  }
  return (
    <TouchableOpacity onPress={() => Linking.openURL(externalUrl)}>
      <BrandText
        numberOfLines={numberOfLines}
        style={[
          {
            //@ts-expect-error
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
