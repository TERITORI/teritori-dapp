import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, height } from "../../utils/style/buttons";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const _SecondaryButtonOutlineTest: React.FC<{
  format: "XL" | "M" | "SM" | "XS";
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  style?: ViewStyle | ViewStyle[];
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  format,
  text,
  onPress,
  squaresBackgroundColor,
  backgroundColor = neutral33,
  color = "#FFFFFF",
  borderColor = "#FFFFFF",
  style,
  iconSVG,
  disabled = false,
}) => {
  return (
    <View style={[style, { flexDirection: "row", height: height(format) }]}>
      <TertiaryBox
        onPress={onPress}
        borderRadius={borderRadius(format)}
        backgroundColor={backgroundColor}
        height={height(format)}
        paddingHorizontal={20}
        disabled={disabled}
        squaresBackgroundColor={squaresBackgroundColor}
        width={width}
        borderColor={borderColor}
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
      </TertiaryBox>
    </View>
  );
};
