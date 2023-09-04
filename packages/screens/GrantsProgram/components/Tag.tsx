import React from "react";
import { ViewStyle } from "react-native";

import { SimpleButton } from "../../../components/buttons/SimpleButton";
import { neutral00, neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

export const Tag: React.FC<{
  text: string;
  color?: string;
  bgColor?: string;
  size?: "XS" | "SM" | "M" | "XL";
  borderColor?: string;
  containerStyle?: ViewStyle;
}> = ({ text, bgColor, color, borderColor, size, containerStyle }) => {
  return (
    <SimpleButton
      bgColor={bgColor || neutral00}
      color={color || neutral77}
      text={text}
      size={size || "XS"}
      style={[
        fontSemibold13,
        { borderRadius: 4 },
        borderColor
          ? { borderColor }
          : // If border is not given then take the background color as border
            {
              borderColor:
                bgColor === neutral00 || bgColor === undefined
                  ? neutral33
                  : bgColor,
            },
      ]}
      containerStyle={containerStyle}
    />
  );
};
