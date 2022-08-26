import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, ButtonsSize, height } from "../../utils/style/buttons";
import {
  neutral77,
  primaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const PrimaryButton: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <SecondaryBox
      onPress={onPress}
      borderRadius={borderRadius(size)}
      backgroundColor={primaryColor}
      height={height(size)}
      paddingHorizontal={20}
      style={style}
      disabled={disabled}
      fullWidth={fullWidth}
      squaresBackgroundColor={squaresBackgroundColor}
      width={width}
      mainContainerStyle={{ flexDirection: "row" }}
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
          {
            color: disabled ? neutral77 : primaryTextColor,
            textAlign: "center",
          },
        ]}
      >
        {text}
      </BrandText>
    </SecondaryBox>
  );
};
