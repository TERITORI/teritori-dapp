import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import { primaryTextColor, yellowDefault } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface SimpleButtonProps {
  title: string;
  size?: "medium" | "small";
  svgIcon?: React.FC<SvgProps>;
  color?: string;
  bgColor?: string;
  onPress?(): void;
  containerStyle?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  size = "medium",
  color = primaryTextColor,
  bgColor = yellowDefault,
  onPress,
  loading,
  disabled,
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
    <TouchableOpacity
      disabled={disabled}
      style={[containerStyle, (loading || disabled) && { opacity: 0.6 }]}
      onPress={() => !loading && onPress?.()}
    >
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
        {loading ? "Loading..." : title}
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
