import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { dangerColor } from "../../../../utils/style/colors";
import { fontBold16, fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type Props = {
  title?: string;
  description?: string;
};

export const RedAlert = ({ description, title }: Props) => {
  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 69, 58, 0.20)",
        paddingHorizontal: layout.spacing_x1_5,
        paddingVertical: layout.spacing_x1_5,
        backgroundColor: "rgba(42, 10, 8, 0.9)",
      }}
    >
      {title && (
        <BrandText
          style={[
            fontBold16,
            { color: dangerColor, marginBottom: layout.spacing_x1_5 },
          ]}
        >
          {title}
        </BrandText>
      )}
      {description && (
        <BrandText
          style={[fontMedium16, { color: dangerColor, lineHeight: 22 }]}
        >
          {description}
        </BrandText>
      )}
    </View>
  );
};
