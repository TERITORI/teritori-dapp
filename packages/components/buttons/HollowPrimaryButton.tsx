import * as React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SecondaryCard } from "../cards/SecondaryCard";

export const HollowPrimaryButton: React.FC<{
  text: string;
  textStyle?: TextStyle;
  width?: number | string;
  height?: number;
  paddingHorizontal?: number;
  onPress?: () => void;
  squaresBackgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}> = ({
  text,
  style,
  textStyle,
  onPress,
  width,
  height = 56,
  paddingHorizontal = 20,
  squaresBackgroundColor = "#000000",
  disabled = false,
}) => {
  return (
    <View
      style={[
        style,
        { flexDirection: "row", height, minHeight: height, maxHeight: height },
      ]}
    >
      <SecondaryCard
        onPress={onPress}
        borderRadius={6}
        backgroundColor="#000000"
        height={height}
        paddingHorizontal={paddingHorizontal}
        disabled={disabled}
        squaresBackgroundColor={squaresBackgroundColor}
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
    </View>
  );
};
