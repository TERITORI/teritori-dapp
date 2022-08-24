import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, height } from "../../utils/style/buttons";
import { neutral30, neutral77, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

// Same as PrimaryButton but with customizable color and backgroundColor
export const _SecondaryButtonTest: React.FC<{
  format: "XL" | "M" | "SM" | "XS";
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
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
  backgroundColor = neutral30,
  color = primaryColor,
  style,
  iconSVG,
  disabled = false,
}) => {
  return (
    <View style={[style, { flexDirection: "row", height: height(format) }]}>
      <SecondaryBox
        onPress={onPress}
        borderRadius={borderRadius(format)}
        backgroundColor={backgroundColor}
        height={height(format)}
        paddingHorizontal={20}
        disabled={disabled}
        squaresBackgroundColor={squaresBackgroundColor}
        width={width}
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
    </View>
  );
};
