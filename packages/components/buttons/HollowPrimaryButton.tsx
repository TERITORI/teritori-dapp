import * as React from "react";
import { TextStyle, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SecondaryCard } from "../cards/SecondaryCard";

export const HollowPrimaryButton: React.FC<{
  text: string;
  textStyle?: TextStyle;
  width?: number | string;
  height?: number;
  paddingH?: number;
  onPress: () => void;
  squaresBckgColor?: string;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}> = ({
  text,
  style,
  textStyle,
  onPress,
  width = "fit-content",
  height = 56,
  paddingH = 20,
  squaresBckgColor = "#000000",
  disabled = false,
}) => {
  return (
    <SecondaryCard
      onPress={onPress}
      borderRadius={6}
      style={style}
      backgroundColor="#000000"
      height={height}
      paddingH={paddingH}
      disabled={disabled}
      squaresBckgColor={squaresBckgColor}
      width={width}
      borderColor={primaryColor}
    >
      <BrandText
        style={[
          { color: primaryColor, fontSize: 14, textAlign: "center" },
          textStyle,
        ]}
      >
        {text}
      </BrandText>
    </SecondaryCard>
  );
};
