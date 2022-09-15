import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { successColor, withAlpha } from "../../utils/style/colors";
import { fontMedium10 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";

export const SuccessBadge: React.FC<{
  label: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, style }) => {
  return (
    <View
      style={[
        {
          alignItems: "center",
          height: 22,
          borderRadius: 999,
          paddingVertical: 5,
          paddingHorizontal: 12,
          backgroundColor: withAlpha(successColor, 0.1),
        },
        style,
      ]}
    >
      <BrandText style={[fontMedium10, { color: successColor }]}>
        {label}
      </BrandText>
    </View>
  );
};
