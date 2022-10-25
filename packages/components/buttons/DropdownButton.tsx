import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import chevronDownSVG from "../../../assets/icons/chevronDown.svg";
import {
  ButtonsSize,
  cornerWidthDropdownButton,
  heightDropdownButton,
} from "../../utils/style/buttons";
import { codGrayColor, white } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const DropdownButton: React.FC<{
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
      <SecondaryBox
        cornerWidth={cornerWidthDropdownButton(size)}
        height={heightDropdownButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: layout.borderRadius - 6,
          backgroundColor: codGrayColor,
          paddingRight: layout.padding_x1,
          paddingLeft: layout.padding_x1,
        }}
        {...boxProps}
      >
        <BrandText
          style={[
            fontSemibold14,
            {
              color: white,
              textAlign: "center",
              marginRight: layout.padding_x0_5,
            },
          ]}
        >
          {isExpanded ? textExpanded : textCompressed}
        </BrandText>

        <SVG
          source={isExpanded ? chevronDownSVG : chevronUpSVG}
          color={white}
          width={16}
          height={16}
        />
      </SecondaryBox>
    </TouchableOpacity>
  );
};
