import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import { neutral30, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const SecondaryButton: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  numberOfLines?: number;
  activeOpacity?: number | undefined;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  backgroundColor = neutral30,
  color = primaryColor,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
  numberOfLines,
  activeOpacity,
}) => {
  const boxProps = {
    style,
    disabled,
    squaresBackgroundColor,
    width,
    fullWidth,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ width: fullWidth ? "100%" : width }}
      activeOpacity={activeOpacity}
    >
      <SecondaryBox
        height={heightButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor,
          paddingHorizontal: 20,
          opacity: disabled ? 0.5 : 1,
          width: "100%",
        }}
        {...boxProps}
      >
        {iconSVG ? (
          <SVG
            source={iconSVG}
            width={16}
            height={16}
            style={{ marginRight: 8 }}
          />
        ) : null}

        <BrandText
          style={[
            fontSemibold14,
            { color, textAlign: "center", width: "100%" },
          ]}
          numberOfLines={numberOfLines}
        >
          {text}
        </BrandText>
      </SecondaryBox>
    </TouchableOpacity>
  );
};
