import React from "react";
import { View, ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontSemibold15 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export const HeaderContent: React.FC<{
  header: string;
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ header, children, style }) => {
  return (
    <View style={style}>
      <BrandText style={[fontSemibold15, { color: neutral77 }]}>
        {header}
      </BrandText>
      <View style={listToggle}>{children}</View>
    </View>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: layout.spacing_x1_5,
};
