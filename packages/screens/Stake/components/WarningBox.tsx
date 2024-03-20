import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

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
    <View style={[styles.stakeWarningContainer]}>
      <SVG
        width={24}
        height={24}
        source={warningTriangleSVG}
        style={{ flexShrink: 0 }}
      />
      <SpacerRow size={3} />
      <View style={{ paddingRight: layout.spacing_x3_5 }}>
        <BrandText style={[fontSemibold13, { width: "100%", maxWidth }]}>
          {title}
        </BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, { maxWidth }]}>
          {description}
        </BrandText>
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  stakeWarningContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: errorColor,
    borderRadius: layout.borderRadius * 0.65,
    paddingVertical: layout.spacing_x1_5,
    paddingHorizontal: layout.spacing_x3,
  },
  alternateText: {
    ...StyleSheet.flatten(fontSemibold12),
    color: neutral77,
  },
});
