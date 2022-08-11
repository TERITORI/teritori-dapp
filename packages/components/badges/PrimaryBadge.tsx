import * as React from "react";
import { View, ViewStyle } from "react-native";

import { primaryColor } from "../../utils/style/colors";
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
        },
        style,
      ]}
    >
      <BrandText style={{ fontSize: 14, color: "#000000", lineHeight: 16 }}>
        {label}
      </BrandText>
    </View>
  );
};
