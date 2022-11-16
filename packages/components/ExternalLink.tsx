import React from "react";
import {
  TextStyle,
  TouchableOpacity,
  Linking,
  StyleProp,
  TextProps,
} from "react-native";

import { gradientBlue } from "../utils/style/colors";
import { GradientText } from "./gradientText";

// FIXME: use <a> tag on web

export const ExternalLink: React.FC<
  {
    externalUrl: string | null | undefined;
    style?: StyleProp<TextStyle>;
    gradient?: string;
  } & TextProps
> = ({
  children,
  externalUrl,
  style,
  gradient = gradientBlue,
  ...textProps
}) => {
  return (
    <TouchableOpacity
      onPress={() => externalUrl && Linking.openURL(externalUrl)}
    >
      <GradientText gradient={gradient} style={style} {...textProps}>
        {children}
      </GradientText>
    </TouchableOpacity>
  );
};
