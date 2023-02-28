import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import { neutral30, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const SecondaryButton: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: (() => Promise<void>) | (() => void);
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  paddingHorizontal?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  numberOfLines?: number;
  activeOpacity?: number | undefined;
  loader?: boolean;
  textStyle?: TextStyle;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  backgroundColor = neutral30,
  paddingHorizontal = 20,
  color = primaryColor,
  style,
  touchableStyle,
  iconSVG,
  disabled = false,
  fullWidth = false,
  numberOfLines,
  activeOpacity,
  loader,
  textStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = useCallback(async () => {
    if (isLoading || !onPress) {
      return;
    }
    setIsLoading(true);
    try {
      await onPress();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }, [onPress, isLoading]);

  const boxProps = {
    style,
    disabled,
    squaresBackgroundColor,
    width,
    fullWidth,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[{ width: fullWidth ? "100%" : width }, touchableStyle]}
      activeOpacity={activeOpacity}
    >
      <SecondaryBox
        height={heightButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor,
          paddingHorizontal,
          opacity: disabled ? 0.5 : 1,
          width: "100%",
        }}
        {...boxProps}
      >
        {loader && isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
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
                { color, textAlign: "center", width: "100%" },
                textStyle,
              ]}
              numberOfLines={numberOfLines}
            >
              {text}
            </BrandText>
          </>
        )}
      </SecondaryBox>
    </TouchableOpacity>
  );
};
