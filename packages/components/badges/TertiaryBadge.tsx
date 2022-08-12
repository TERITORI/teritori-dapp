import * as React from "react";
import { View, ViewStyle } from "react-native";

import { neutral33 } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const TertiaryBadge: React.FC<{
  label: string;
  style?: ViewStyle;
}> = ({ label, style }) => {
  return (
    <View
      style={[
        {
          paddingVertical: 5,
          paddingHorizontal: 12,
          backgroundColor: neutral33,
          borderRadius: 999,
          width: "fit-content",
          height: 28,
        },
        style,
      ]}
    >
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </View>
  );
};
