import React from "react";
import {
  TextStyle,
  TouchableOpacity,
  Linking,
  StyleProp,
  TextProps,
  Platform,
} from "react-native";

import { BrandText } from "./BrandText";
import { GradientText, GradientType } from "./gradientText";

// FIXME: use <a> tag on web

export const ExternalLink: React.FC<
  {
    externalUrl: string | null | undefined;
    style?: StyleProp<TextStyle>;
    gradientType?: GradientType;
  } & TextProps
> = ({ children, externalUrl, style, gradientType = "blue", ...textProps }) => {
  return (
    <TouchableOpacity
      onPress={() => externalUrl && Linking.openURL(externalUrl)}
    >
      {Platform.OS === "web" ? (
        <GradientText gradientType={gradientType} style={style} {...textProps}>
          {children}
        </GradientText>
      ) : (
        <BrandText style={style} {...textProps}>
          {children}
        </BrandText>
      )}
    </TouchableOpacity>
  );
};
