import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import { primaryColor, primaryTextColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { BoxStyle } from "../boxes/Box";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const PrimaryButton: React.FC<{
  size?: ButtonsSize;
  text: string;
  width?: number;
  onPress?: (() => Promise<void>) | (() => void);
  boxStyle?: StyleProp<BoxStyle>;
  iconSVG?: React.FC<SvgProps>;
  iconColor?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  loader?: boolean;
  touchableStyle?: StyleProp<ViewStyle>;
  RightComponent?: React.FC;
  color?: string;
  isLoading?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size = "M",
  text,
  onPress,
  boxStyle: style,
  iconSVG,
  disabled = false,
  fullWidth = false,
  loader,
  touchableStyle = {},
  RightComponent,
  iconColor,
  color = primaryColor,
  isLoading: isLoadingProp,
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handlePress = useCallback(async () => {
    if (isLocalLoading || !onPress) {
      return;
    }
    setIsLocalLoading(true);
    try {
      await onPress();
    } catch (err) {
      console.error(err);
    }
    setIsLocalLoading(false);
  }, [onPress, isLocalLoading]);

  const isLoading = !!(loader && (isLocalLoading || isLoadingProp));

  const isDisabled = !!(disabled || isLoading);

  return (
    <Pressable
      onPress={onPress ? handlePress : undefined}
      disabled={isDisabled}
      style={[
        {
          width: fullWidth ? "100%" : width,
          flexDirection: "row",
        },
        touchableStyle,
      ]}
      onHoverIn={() => {
        setHovered(true);
      }}
      onHoverOut={() => {
        setHovered(false);
      }}
    >
      <SecondaryBox
        style={[
          {
            borderRadius: borderRadiusButton(size),
            backgroundColor: color,
            padding: 0,
            paddingHorizontal: 20,
            opacity: isDisabled ? 0.5 : 1,
            height: heightButton(size),
            alignItems: "center",
            justifyContent: "center",
            width: fullWidth ? "100%" : width,
            borderColor: hovered ? "white" : color,
            borderWidth: 1,
          },
          style,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            opacity: isLoading ? 0 : 1,
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

          <BrandText
            style={[
              fontSemibold14,
              {
                color: primaryTextColor,
                textAlign: "center",
              },
            ]}
          >
            {text}
          </BrandText>
          {!!RightComponent && <RightComponent />}
        </View>
        {isLoading && (
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
