import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { borderRadius, height } from "../../utils/style/buttons";
import {
  neutral77,
  primaryColor,
  primaryTextColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const _PrimaryButtonTest: React.FC<{
  format: "XL" | "M" | "SM" | "XS";
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
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
  style,
  iconSVG,
  disabled = false,
}) => {
  return (
    <View style={[style, { flexDirection: "row", height: height(format) }]}>
      <SecondaryBox
        onPress={onPress}
        borderRadius={borderRadius(format)}
        backgroundColor={primaryColor}
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
            {
              color: disabled ? neutral77 : primaryTextColor,
              textAlign: "center",
            },
          ]}
        >
          {text}
        </BrandText>
      </SecondaryBox>
    </View>
  );
};
