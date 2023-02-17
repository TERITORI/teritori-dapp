// libraries
import React from "react";
import { StyleSheet, View } from "react-native";

import toriSVG from "../../../assets/icons/networks/teritori-circle.svg";
import { neutral22, neutralA3 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SpacerColumn, SpacerRow } from "../spacer";

type CollectionStatProps = {
  label: string;
  value: string;
  addLogo?: boolean;
};

const iconSize = 16;

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
            <View style={{ width: iconSize, height: iconSize }}>
              <SVG source={toriSVG} width={iconSize} height={iconSize} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 176,
    height: 64,
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
    alignItems: "center",
  },
});
