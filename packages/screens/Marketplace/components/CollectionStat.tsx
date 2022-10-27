// libraries
import React from "react";
import { StyleSheet, View } from "react-native";

import logoSVG from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral22, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type CollectionStatProps = {
  label: string;
  value: string;
  addLogo?: boolean;
};

export const CollectionStat = ({
  label,
  value,
  addLogo,
}: CollectionStatProps) => {
  // returns
  return (
    <View style={styles.container}>
      <BrandText style={styles.labelText}>{label}</BrandText>
      <SpacerColumn size={0.75} />
      <View style={styles.rowCenter}>
        <BrandText style={fontSemibold14}>{value}</BrandText>
        {addLogo && (
          <>
            <SpacerRow size={0.75} />
            <SVG source={logoSVG} width={16} height={16} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: layout.padding_x1,
    paddingVertical: layout.padding_x1_5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: neutral22,
  },
  labelText: StyleSheet.flatten([
    fontSemibold12,
    {
      color: neutralA3,
    },
  ]),
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
