import React, { FC, ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const TableTextCell: FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}> = ({ children, style, textStyle }) => {
  return (
    <View
      style={[
        {
          marginRight: layout.spacing_x1,
        },
        style,
      ]}
    >
      <BrandText style={[fontSemibold13, textStyle]} numberOfLines={1}>
        {children}
      </BrandText>
    </View>
  );
};
