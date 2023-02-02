import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

import warningTriangleSVG from "../../../../assets/icons/warning-triangle.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerRow, SpacerColumn } from "../../../components/spacer";
import { errorColor, neutral77 } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold12 } from "../../../utils/style/fonts";
import { layout, smallMobileWidth } from "../../../utils/style/layout";

export const WarningBox: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.stakeWarningContainer}>
      <SVG width={24} height={24} source={warningTriangleSVG} />
      {width > smallMobileWidth && <SpacerRow size={3} />}
      <View style={{ width: "100%" }}>
        <BrandText style={fontSemibold13}>{title}</BrandText>
        <SpacerColumn size={0.5} />
        <BrandText style={[styles.alternateText, { maxWidth: 350 }]}>
          {description}
        </BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stakeWarningContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: errorColor,
    borderRadius: layout.borderRadius * 0.65,
    paddingVertical: layout.padding_x1_5,
    paddingHorizontal: layout.padding_x3,
  },
  alternateText: {
    ...StyleSheet.flatten(fontSemibold12),
    color: neutral77,
  },
});
