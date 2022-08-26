import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, ButtonsSize, height } from "../../utils/style/buttons";
import { neutral30, neutral77, primaryColor } from "../../utils/style/colors";
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
}) => {
  return (
    <SecondaryBox
      onPress={onPress}
      borderRadius={borderRadius(size)}
      backgroundColor={backgroundColor}
      height={height(size)}
      style={style}
      paddingHorizontal={20}
      disabled={disabled}
      squaresBackgroundColor={squaresBackgroundColor}
      width={width}
      fullWidth={fullWidth}
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
          { color: disabled ? neutral77 : color, textAlign: "center" },
        ]}
      >
        {text}
      </BrandText>
    </SecondaryBox>
  );
};
