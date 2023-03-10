import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
  primaryColor,
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryBox } from "../boxes/SecondaryBox";

export const PrimaryButton: React.FC<{
  size: ButtonsSize;
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
}> = ({
  // If no width, the buttons will fit the content including paddingHorizontal 20
  width,
  size,
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

  const isDisabled = !!(disabled || (loader && isLoading));

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
      <SecondaryBox
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
        {!isLoading && RightComponent && <RightComponent />}
        {loader && isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator color={secondaryColor} />
          </View>
        )}
      </SecondaryBox>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loader: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: primaryColor,
    width: "90%",
    height: "100%",
  },
});
