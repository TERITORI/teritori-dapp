import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  TextStyle,
  View,
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
import { BoxStyle } from "../boxes/Box";
import { SecondaryBox } from "../boxes/SecondaryBox";

// TODO: fix size changing on loading, like in SecondaryButtonOutline

// Same as _PrimaryButtonTest but with customizable color and backgroundColor
export const SecondaryButton: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: (() => Promise<void>) | (() => void);
  backgroundColor?: string;
  paddingHorizontal?: number;
  color?: string;
  style?: StyleProp<BoxStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  numberOfLines?: number;
  loader?: boolean;
  textStyle?: TextStyle;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  backgroundColor = neutral30,
  paddingHorizontal = 20,
  color = primaryColor,
  style,
  touchableStyle,
  iconSVG,
  disabled = false,
  fullWidth = false,
  numberOfLines,
  loader,
  textStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const isDisabled = !!(disabled || (loader && isLoading));

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={[{ width: fullWidth ? "100%" : width }, touchableStyle]}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <SecondaryBox
        style={[
          {
            borderRadius: borderRadiusButton(size),
            backgroundColor,
            paddingHorizontal,
            opacity: isDisabled ? 0.5 : 1,
            width: fullWidth ? "100%" : width,
            borderWidth: 1,
            borderColor: hovered ? "white" : backgroundColor,
            height: heightButton(size),
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <View style={{ flexDirection: "row", opacity: isLoading ? 0 : 1 }}>
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
                color,
                textAlign: "center",
                width: "100%",
              },
              textStyle,
            ]}
            numberOfLines={numberOfLines}
          >
            {text}
          </BrandText>
        </View>
        {!!(loader && isLoading) && (
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <ActivityIndicator />
          </View>
        )}
      </SecondaryBox>
    </Pressable>
  );
};
