import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
  horizontalPaddingButton,
} from "../../utils/style/buttons";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const PrimaryButtonOutline: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  color?: string;
  noBrokenCorners?: boolean;
  isLoading?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  style,
  touchableStyle = {},
  iconSVG,
  disabled = false,
  fullWidth = false,
  color = primaryColor,
  noBrokenCorners = false,
  isLoading,
}) => {
  const boxProps = {
    style,
    disabled,
    squaresBackgroundColor,
    width,
    fullWidth,
    noBrokenCorners,
    disabledBorderColor: color,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        { width: fullWidth ? "100%" : width, opacity: disabled ? 0.5 : 1 },
        touchableStyle,
      ]}
    >
      <TertiaryBox
        height={heightButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor: "#000000",
          paddingHorizontal: horizontalPaddingButton(size),
          borderColor: color,
        }}
        {...boxProps}
      >
        {isLoading ? (
          <ActivityIndicator color={primaryColor} />
        ) : (
          <>
            {iconSVG ? (
              <SVG
                source={iconSVG}
                color={color}
                width={16}
                height={16}
                style={{ marginRight: 8 }}
              />
            ) : null}

            <BrandText style={[fontSemibold14, { color, textAlign: "center" }]}>
              {text}
            </BrandText>
          </>
        )}
      </TertiaryBox>
    </TouchableOpacity>
  );
};
