import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const Badge: React.FC<{
  color: string;
  label: string;
  backgroundColor: string;
}> = ({ color, label, backgroundColor }) => {
  return (
    <View
      style={{
        backgroundColor,
        width: "fit-content",
        height: "fit-content",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginRight: layout.padding_x1_5,
      }}
    >
      <BrandText
        style={[
          {
            color,
            paddingLeft: layout.padding_x1_5,
            paddingRight: layout.padding_x1_5,
            paddingTop: layout.padding_x0_5,
            paddingBottom: layout.padding_x0_5,
          },
          fontSemibold13,
        ]}
      >
        {label}
      </BrandText>
    </View>
  );
};
