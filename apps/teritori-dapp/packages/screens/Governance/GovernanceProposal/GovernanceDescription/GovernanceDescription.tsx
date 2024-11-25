import React from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "@/utils/style/fonts";

export const GovernanceDescription: React.FC<{
  description: string;
}> = ({ description }) => {
  const isMobile = useIsMobile();
  return (
    <View style={{ flex: 1, marginBottom: isMobile ? 75 : 0 }}>
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
