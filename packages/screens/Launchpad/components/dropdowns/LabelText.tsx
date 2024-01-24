import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { additionalRed, neutral77 } from "../../../../utils/style/colors";
import { fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

export const LabelText = ({ label }: { label: string }) => {
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <BrandText
        style={[
          fontSemibold14,
          {
            marginRight: layout.spacing_x1,
            color: neutral77,
            marginBottom: layout.spacing_x1,
          },
        ]}
      >
        {label}
      </BrandText>

      <BrandText
        style={[
          fontSemibold14,
          { color: additionalRed, marginLeft: layout.spacing_x0_25 },
        ]}
      >
        *
      </BrandText>
    </View>
  );
};
