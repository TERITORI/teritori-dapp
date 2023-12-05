import React, { useCallback, useState } from "react";
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
} from "../../utils/style/buttons";
import { primaryColor, primaryTextColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { LegacySecondaryBox } from "../boxes/LegacySecondaryBox";

export const PrimaryButton: React.FC<{
  size?: ButtonsSize;
  text: string;
  width?: number;
  onPress?: (() => Promise<void>) | (() => void);
  squaresBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  iconSVG?: React.FC<SvgProps>;
  iconColor?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  loader?: boolean;
  touchableStyle?: StyleProp<ViewStyle>;
  RightComponent?: React.FC;
  color?: string;
  noBrokenCorners?: boolean;
  isLoading?: boolean;
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size = "M",
  text,
  onPress,
  squaresBackgroundColor,
  style,
  iconSVG,
  disabled = false,
  fullWidth = false,
  loader,
  touchableStyle = {},
  RightComponent,
  iconColor,
  color = primaryColor,
  noBrokenCorners = false,
  isLoading,
}) => {
  const [isLocalLoading, setIsLocalLoading] = useState(false);

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

  const isDisabled = !!(disabled || (loader && (isLocalLoading || isLoading)));

  const boxProps = {
    style,
    disabled,
    squaresBackgroundColor,
    width,
    fullWidth,
    noBrokenCorners,
  };

  return (
    <TouchableOpacity
      onPress={onPress ? handlePress : undefined}
      disabled={isDisabled}
      style={[{ width: fullWidth ? "100%" : width }, touchableStyle]}
    >
      <LegacySecondaryBox
        height={heightButton(size)}
        mainContainerStyle={{
          flexDirection: "row",
          borderRadius: borderRadiusButton(size),
          backgroundColor: color,
          paddingHorizontal: 20,
          opacity: isDisabled ? 0.5 : 1,
        }}
        {...boxProps}
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

        {(loader && isLocalLoading) || isLoading ? (
          <ActivityIndicator color={primaryTextColor} />
        ) : (
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
        )}
        {!(isLocalLoading || isLoading) && RightComponent && <RightComponent />}
      </LegacySecondaryBox>
    </TouchableOpacity>
  );
};
