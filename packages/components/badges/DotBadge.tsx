import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { neutral17, purpleDefault } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const DotBadge: React.FC<{
  label: string | number;
  dotColor?: string;
  style?: StyleProp<ViewStyle>;
}> = ({ label, dotColor = purpleDefault, style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: 26,
          paddingHorizontal: layout.padding_x1_5,
          backgroundColor: neutral17,
          borderRadius: 999,
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: dotColor,
          borderRadius: 999,
          marginRight: layout.padding_x1_5 / 2,
          width: 6,
          height: 6,
        }}
      />
      <BrandText style={fontSemibold13}>{label}</BrandText>
    </View>
  );
};
