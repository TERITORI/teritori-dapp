import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import { primaryColor } from "../../utils/style/colors";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const IconButton: React.FC<{
  width?: number;
  size: ButtonsSize;
  onPress?: (() => Promise<void>) | (() => void);
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconSVG: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  squaresBorderColor?: string;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  onPress,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
  iconSize = 16,
  iconColor = "black",
  backgroundColor = primaryColor,
  borderColor,
  squaresBorderColor,
}) => {
  const boxProps = {
    style,
    disabled,
    width,
    fullWidth,
  };

  return (
    // <View
    //   style={[
    //     style,
    //     {
    //       flexDirection: "row",
    //       height,
    //       minHeight: height,
    //       maxHeight: height,
    //     },
    //   ]}
    // >
    //   <PrimaryButton
    //     onPress={onPress}
    //     // borderRadius={6}
    //     // backgroundColor={backgroundColor}
    //     // height={height}
    //     // paddingHorizontal={paddingHorizontal}
    //     disabled={disabled}
    //     squaresBackgroundColor={squaresBackgroundColor}
    //     // width={width}
    //     size="M"
    //     // text="oui"
    //     // borderColor={borderColor}
    //     iconSVG={icon}
    //   />
    // </View>

    <TouchableOpacity
      onPress={onPress}
      style={{ width: fullWidth ? "100%" : width }}
    >
      <SecondaryBox
        height={heightButton(size)}
        mainContainerStyle={[
          {
            flexDirection: "row",
            borderRadius: borderRadiusButton(size),
            backgroundColor,
            paddingHorizontal: 20,
          },
          borderColor && { borderWidth: 1, borderColor },
        ]}
        squaresBorderColor={squaresBorderColor}
        {...boxProps}
      >
        <SVG
          source={iconSVG}
          width={iconSize}
          height={iconSize}
          color={iconColor}
        />
      </SecondaryBox>
    </TouchableOpacity>
  );
};
