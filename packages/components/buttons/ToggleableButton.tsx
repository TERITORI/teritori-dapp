import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import {
  ButtonsSize,
  cornerWidthDropdownButton,
  heightDropdownButton,
} from "../../utils/style/buttons";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { LegacySecondaryBox } from "../boxes/LegacySecondaryBox";

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const ToggleableButton: React.FC<{
  size?: ButtonsSize;
  textExpanded: string;
  textCompressed: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  isExpanded?: boolean;
  color?: string;
  style?: StyleProp<ViewStyle>;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size = "XS",
  textExpanded,
  textCompressed,
  onPress,
  squaresBackgroundColor,
  isExpanded = false,
  style,
}) => {
  const boxProps = {
    style,
    squaresBackgroundColor,
    width,
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LegacySecondaryBox
        cornerWidth={cornerWidthDropdownButton(size)}
        height={heightDropdownButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: 6,
          backgroundColor: neutral33,
          paddingRight: 6,
          paddingLeft: 8,
        }}
        {...boxProps}
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
      </LegacySecondaryBox>
    </TouchableOpacity>
  );
};
