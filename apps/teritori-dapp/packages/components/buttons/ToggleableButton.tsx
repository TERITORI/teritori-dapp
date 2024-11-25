import React from "react";
import { StyleProp, TouchableOpacity } from "react-native";

import chevronDownSVG from "@/assets/icons/chevron-down.svg";
import chevronUpSVG from "@/assets/icons/chevron-up.svg";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { SecondaryBox } from "../boxes/SecondaryBox";

import { ButtonsSize } from "@/utils/style/buttons";
import { neutral33, secondaryColor } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const ToggleableButton: React.FC<{
  textExpanded: string;
  textCompressed: string;
  size?: ButtonsSize;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  isExpanded?: boolean;
  color?: string;
  style?: StyleProp<BoxStyle>;
}> = ({
  textExpanded,
  textCompressed,
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  onPress,
  isExpanded = false,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <SecondaryBox
        style={[
          style,
          {
            flexDirection: "row",
            borderRadius: 6,
            backgroundColor: neutral33,
            paddingRight: 6,
            paddingLeft: 8,
            width,
          },
        ]}
      >
        <BrandText
          style={[
            fontSemibold12,
            { color: "#FFFFFF", textAlign: "center", marginRight: 4 },
          ]}
        >
          {isExpanded ? textExpanded : textCompressed}
        </BrandText>

        <SVG
          source={isExpanded ? chevronUpSVG : chevronDownSVG}
          width={16}
          height={16}
          color={secondaryColor}
        />
      </SecondaryBox>
    </TouchableOpacity>
  );
};
