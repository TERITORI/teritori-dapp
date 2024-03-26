import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const GovernanceDescription: React.FC<{
  description: string;
}> = ({ description }) => {
  return (
    <View style={{ width: 1290 }}>
      <BrandText
        style={[
          fontSemibold20,
          {
            color: secondaryColor,
          },
        ]}
      >
        Description
      </BrandText>
      <SpacerColumn size={2} />
      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
          },
        ]}
      >
        {description}
      </BrandText>
    </View>
  );
};
