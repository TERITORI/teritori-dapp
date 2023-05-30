import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

import { neutral11, neutral22 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";

export const MoreReactionsButton: React.FC<{
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          height: 28,
          width: 43,
          paddingRight: layout.padding_x1,
          paddingLeft: layout.padding_x0_75,
          backgroundColor: neutral11,
          borderColor: neutral22,
          borderWidth: 1,
          borderRadius: 6,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </TouchableOpacity>
  );
};
