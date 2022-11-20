import React from "react";
import { StyleSheet, TouchableOpacity, ViewProps, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { primaryTextColor, yellowDefault } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface SimpleButtonProps {
  title: string;
  size?: "medium" | "small";
  style?: ViewStyle,
  color?: string;
  bgColor?: string;
  onPress?(): void;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  size = "medium",
  style,
  color = primaryTextColor,
  bgColor = yellowDefault,
}) => {
  let padH: number;
  let padV: number;

  switch (size) {
    case "medium":
      padH = 22;
      padV = 16;
      break;
    case "small":
      padH = 16;
      padV = 12;
      break;
  }

  return (
    <TouchableOpacity>
      <BrandText
        style={[
          style,
          styles.btnStyle,
          {
            color,
            backgroundColor: bgColor,
            paddingHorizontal: padH,
            paddingVertical: padV,
          },
        ]}
      >
        {title}
      </BrandText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    marginTop: 40,
    alignSelf: "center",
    borderRadius: 12,
    ...(fontSemibold14 as object),
  },
});
