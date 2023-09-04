import React from "react";
import { View, StyleSheet } from "react-native";

import warningTriangleSVG from "../../../../assets/icons/warning-triangle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow, SpacerColumn } from "../../../components/spacer";
import { errorColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const WarningBox: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <View style={styles.stakeWarningContainer}>
      <SVG width={24} height={24} source={warningTriangleSVG} />
      <SpacerRow size={3} />
      <View>
        <BrandText style={fontSemibold13}>{title}</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, { maxWidth: 350 }]}>
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
