import React from "react";
import { View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

import { primaryColor } from "../../utils/style/colors";
import { SVG } from "../SVG";
import { SecondaryCard } from "../cards/SecondaryCard";

export const IconButton: React.FC<{
  width?: number | string;
  height?: number;
  paddingHorizontal?: number;
  icon: React.FC<SvgProps>;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  iconColor: string;
  iconWidth: number;
  iconHeight: number;
  disabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}> = ({
  width,
  height = 56,
  icon,
  onPress,
  paddingHorizontal = 20,
  squaresBackgroundColor = "#000000",
  borderColor = "#000000",
  style,
  iconColor,
  iconWidth,
  iconHeight,
  disabled = false,
  backgroundColor = primaryColor,
}) => {
  return (
    <View
      style={[
        style,
        {
          flexDirection: "row",
          height,
          minHeight: height,
          maxHeight: height,
        },
      ]}
    >
      <SecondaryCard
        onPress={onPress}
        borderRadius={6}
        backgroundColor={backgroundColor}
        height={height}
        paddingHorizontal={paddingHorizontal}
        disabled={disabled}
        squaresBackgroundColor={squaresBackgroundColor}
        width={width}
        borderColor={borderColor}
      >
        <SVG
          source={icon}
          style={{ alignSelf: "center" }}
          color={iconColor}
          width={iconWidth}
          height={iconHeight}
        />
      </SecondaryCard>
    </View>
  );
};
