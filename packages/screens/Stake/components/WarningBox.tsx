import React from "react";
import { View, useWindowDimensions } from "react-native";

import warningTriangleSVG from "../../../../assets/icons/warning-triangle.svg";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { errorColor, neutral77 } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const WarningBox: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  const { width: windowWidth } = useWindowDimensions();
  const maxWidth = windowWidth - 20 >= 490 ? 350 : 300;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: errorColor,
        borderRadius: layout.borderRadius * 0.65,
        paddingVertical: layout.spacing_x1_5,
        paddingHorizontal: layout.spacing_x3,
      }}
    >
      <SVG
        width={24}
        height={24}
        source={warningTriangleSVG}
        color={errorColor}
        style={{ flexShrink: 0 }}
      />
      <SpacerRow size={3} />
      <View style={{ paddingRight: layout.spacing_x3_5 }}>
        <BrandText style={[fontSemibold13, { width: "100%", maxWidth }]}>
          {title}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[fontSemibold12, { color: neutral77, maxWidth }]}>
          {description}
        </BrandText>
      </View>
    </View>
  );
};
