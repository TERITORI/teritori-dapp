import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { primaryTextColor, yellowDefault } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface SimpleButtonProps {
  title: string;
  size?: "medium" | "small";
  color?: string;
  bgColor?: string;
  onPress?(): void;
  containerStyle?: ViewStyle;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  size = "medium",
  color = primaryTextColor,
  bgColor = yellowDefault,
  onPress,
  containerStyle,
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
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <BrandText
        style={[
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
    alignSelf: "center",
    borderRadius: 12,
    ...(fontSemibold14 as object),
  },
});

export default SimpleButton;
