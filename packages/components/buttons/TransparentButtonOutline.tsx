import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

import {
  borderRadiusButton,
  ButtonsSize,
  heightButton,
} from "../../utils/style/buttons";
import {
  neutral22,
  neutral44,
  secondaryColor,
  transparentColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

export const TransparentButtonOutline: React.FC<{
  size: ButtonsSize;
  text: string;
  width?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  disabled?: boolean;
  fullWidth?: boolean;
  RightComponent?: React.FC;
  iconSize?: number;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
  text,
  onPress,
  squaresBackgroundColor,
  backgroundColor = transparentColor,
  color = secondaryColor,
  borderColor = neutral44,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
  RightComponent,
  iconSize = 16,
}) => {
  const boxProps = {
    style,
    disabled,
    squaresBackgroundColor,
    width,
    fullWidth,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ width: fullWidth ? "100%" : width }}
    >
      <TertiaryBox
        disabledBorderColor={neutral22}
        height={heightButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor,
          paddingHorizontal: 20,
          borderColor,
          justifyContent: "flex-start",
          opacity: disabled ? 0.5 : 1,
        }}
        {...boxProps}
      >
        {iconSVG ? (
          <SVG
            source={iconSVG}
            width={iconSize}
            height={iconSize}
            style={{ marginRight: 8 }}
          />
        ) : null}

        <BrandText style={[fontSemibold14, { color, textAlign: "center" }]}>
          {text}
        </BrandText>
        {RightComponent && (
          <View style={styles.rightComponent}>
            <RightComponent />
          </View>
        )}
      </TertiaryBox>
    </TouchableOpacity>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  rightComponent: {
    flex: 1,
    alignItems: "flex-end",
  },
});
