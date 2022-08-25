import React from "react";
import { ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, height } from "../../utils/style/buttons";
import { neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const PrimaryButtonOutline: React.FC<{
  format: "XL" | "M" | "SM" | "XS";
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  format,
  text,
  onPress,
  squaresBackgroundColor,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <TertiaryBox
      onPress={onPress}
      borderRadius={borderRadius(format)}
      backgroundColor="#000000"
      height={height(format)}
      paddingHorizontal={20}
      disabled={disabled}
      style={style}
      fullWidth={fullWidth}
      squaresBackgroundColor={squaresBackgroundColor}
      width={width}
      borderColor={primaryColor}
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
          { color: disabled ? neutral77 : primaryColor, textAlign: "center" },
        ]}
      >
        {text}
      </BrandText>
    </TertiaryBox>
  );
};
