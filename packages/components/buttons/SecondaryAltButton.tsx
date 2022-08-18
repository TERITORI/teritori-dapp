import React from "react";
import { ViewStyle } from "react-native";

import { neutral30, primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { TertiaryCard } from "../cards/TertiaryCard";

// Tighter than SecondaryButton
export const SecondaryAltButton: React.FC<{
  width?: number | string;
  paddingHorizontal?: number;
  text: string;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}> = ({
  width = "fit-content",
  text,
  onPress,
  squaresBackgroundColor = "#000000",
  style,
  disabled = false,
}) => {
  return (
    <TertiaryCard
      onPress={onPress}
      style={style}
      backgroundColor={neutral30}
      height={36}
      paddingHorizontal={13}
      disabled={disabled}
      squaresBackgroundColor={squaresBackgroundColor}
      width={width}
    >
      <BrandText
        style={[fontSemibold14, { color: primaryColor, textAlign: "center" }]}
      >
        {text}
      </BrandText>
    </TertiaryCard>
  );
};
