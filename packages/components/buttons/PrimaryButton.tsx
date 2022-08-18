import React from "react";
import { ViewStyle } from "react-native";

import { primaryColor, primaryTextColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryCard } from "../cards/TertiaryCard";

export const PrimaryButton: React.FC<{
  width?: number | string;
  height?: number;
  paddingHorizontal?: number;
  text: string;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}> = ({
  width = "fit-content",
  height = 56,
  text,
  onPress,
  paddingHorizontal = 20,
  squaresBackgroundColor = "#000000",
  style,
  disabled = false,
}) => {
  return (
    <TertiaryCard
      onPress={onPress}
      borderRadius={6}
      style={style}
      backgroundColor={primaryColor}
      height={height}
      paddingHorizontal={paddingHorizontal}
      disabled={disabled}
      squaresBackgroundColor={squaresBackgroundColor}
      width={width}
    >
      <BrandText
        style={[
          fontSemibold14,
          { color: primaryTextColor, textAlign: "center" },
        ]}
      >
        {text}
      </BrandText>
    </TertiaryCard>
  );
};
