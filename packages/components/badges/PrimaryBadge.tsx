import * as React from "react";
import { View, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const PrimaryBadge: React.FC<{
  label: string;
  style?: ViewStyle;
}> = ({ label, style }) => {
  return (
    <View
      style={[
        {
          paddingVertical: 4,
          paddingHorizontal: 10,
          backgroundColor: primaryColor,
          borderRadius: 999,
          width: "fit-content",
          height: 24,
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold14, { color: "#000000" }]}>
        {label}
      </BrandText>
    </View>
  );
};
