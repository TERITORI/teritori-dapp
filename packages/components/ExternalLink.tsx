import React from "react";
import {
  TextStyle,
  TouchableOpacity,
  Linking,
  StyleProp,
  TextProps,
} from "react-native";

import { primaryColor } from "../utils/style/colors";
import { BrandText } from "./BrandText";

// FIXME: use <a> tag on web

export const ExternalLink: React.FC<
  {
    externalUrl: string | null | undefined;
    style?: StyleProp<TextStyle>;
  } & TextProps
> = ({ children, externalUrl, style, ...textProps }) => {
  if (!externalUrl) {
    return null;
  }
  return (
    <TouchableOpacity onPress={() => Linking.openURL(externalUrl)}>
      <BrandText
        style={[
          {
            textDecorationLine: "underline",
            // TODO: color gradient blue
            color: primaryColor,
          },
          style,
        ]}
        {...textProps}
      >
        <>{children}</>
      </BrandText>
    </TouchableOpacity>
  );
};
