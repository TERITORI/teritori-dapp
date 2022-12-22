import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import tipSVG from "../../assets/icons/tip.svg";
import { neutral33 } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SocialStat } from "./SocialStat";
import { SpacerRow } from "./spacer";

const SectionDevider = () => (
  <View style={styles.sectionDevider}>
    <View style={styles.seperator} />
  </View>
);

export const SocialReactionActions: React.FC<{ statStyle?: ViewStyle }> = ({
  statStyle,
}) => {
  return (
    <View style={styles.rowCenter}>
      <Pressable style={styles.rowCenter}>
        <SVG source={tipSVG} />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>Tip</BrandText>
      </Pressable>

      <SectionDevider />

      <SocialStat
        label="4,2k"
        emoji="👍"
        style={{ marginRight: layout.padding_x1, ...(statStyle || {}) }}
      />
      <SocialStat
        label="4,2k"
        emoji="🔥"
        style={{ marginRight: layout.padding_x1, ...(statStyle || {}) }}
      />
      <SocialStat label="4,2k" emoji="👎" style={statStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  rowCenter: { flexDirection: "row", alignItems: "center" },
  sectionDevider: {
    paddingHorizontal: layout.padding_x2,
  },
  seperator: { height: 18, width: 1, backgroundColor: neutral33 },
});
