import React, { useCallback, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import { neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

// FIXME: make a BaseButton and only pass backgroun/border and text colors in this kind of components

export const SecondaryButtonOutline: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: (() => Promise<void>) | (() => void);
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  autoLoader?: boolean;
  isLoading?: boolean;
  iconColor?: string;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  backgroundColor = neutral33,
  color = secondaryColor,
  borderColor = secondaryColor,
  style,
  touchableStyle,
  iconSVG,
  disabled = false,
  fullWidth = false,
  autoLoader,
  isLoading,
  iconColor,
}) => {
  const [isAutoLoading, setIsAutoLoading] = useState(false);

  const handlePress = useCallback(async () => {
    if (isAutoLoading || !onPress) {
      return;
    }
    setIsAutoLoading(true);
    try {
      await onPress();
    } catch (err) {
      console.error(err);
    }
    setIsAutoLoading(false);
  }, [onPress, isAutoLoading]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[{ width: fullWidth ? "100%" : width }, touchableStyle]}
    >
      <TertiaryBox
        style={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor,
          paddingHorizontal: 20,
          borderColor,
          opacity: disabled ? 0.5 : 1,
          height: heightButton(size),
        }}
      >
        {iconSVG ? (
          <SVG
            source={iconSVG}
            width={16}
            height={16}
            style={{ marginRight: 8 }}
            color={iconColor}
          />
        ) : null}

        <BrandText style={[fontSemibold14, { color, textAlign: "center" }]}>
          {text}
        </BrandText>

        {(autoLoader && isAutoLoading) ||
          (isLoading && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "2.5%",
                top: "2.5%",
                width: "95%",
                height: "95%",
                backgroundColor,
              }}
            >
              <ActivityIndicator color={color} size="small" />
            </View>
          ))}
      </TertiaryBox>
    </TouchableOpacity>
  );
};
