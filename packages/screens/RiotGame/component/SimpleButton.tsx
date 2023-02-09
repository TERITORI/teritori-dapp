import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import {
  neutral00,
  primaryTextColor,
  yellowDefault,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface SimpleButtonProps {
  text: string;
  size?: "SM" | "M" | "XL";
  color?: string;
  bgColor?: string;
  onPress?(): void;
  containerStyle?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  iconSVG?: React.FC<SvgProps>;
  outline?: boolean;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  text,
  size = "M",
  color = primaryTextColor,
  bgColor = yellowDefault,
  onPress,
  loading,
  disabled,
  containerStyle,
  iconSVG = null,
  outline = false,
}) => {
  let padH: number;
  let padV: number;

  switch (size) {
    case "XL":
      padH = layout.padding_x3;
      padV = layout.padding_x2_5;
      break;
    case "M":
      padH = layout.padding_x2_5;
      padV = layout.padding_x2;
      break;
    case "SM":
      padH = layout.padding_x2;
      padV = layout.padding_x1_5;
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
            display: "flex",
            color: outline ? yellowDefault : color,
            backgroundColor: outline ? neutral00 : bgColor,
            borderColor: outline ? yellowDefault : bgColor,
            borderWidth: 1,
            paddingHorizontal: padH,
            paddingVertical: padV,
          },
        ]}
      >
        {iconSVG && (
          <SVG
            style={{ marginRight: layout.padding_x1 }}
            height={layout.padding_x2}
            source={iconSVG}
          />
        )}
        {loading ? "Loading..." : text}
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
