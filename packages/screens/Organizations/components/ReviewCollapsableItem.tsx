import React from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { SpacerColumn } from "../../../components/spacer";
import { neutral17, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface ReviewCollapsableItemProps {
  title: string;
  value: string | (() => React.ReactNode) | undefined;
}

export const ReviewCollapsableItem: React.FC<ReviewCollapsableItemProps> = ({
  title,
  value,
}) => {
  return (
    <View style={styles.container}>
      <BrandText style={styles.title}>{title}</BrandText>
      <SpacerColumn size={0.5} />
      {typeof value === "string" ? (
        <BrandText style={styles.value}>{value}</BrandText>
      ) : (
        value && value()
      )}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    backgroundColor: neutral17,
    padding: layout.spacing_x1_5,
  },
  title: StyleSheet.flatten([fontSemibold12, { color: neutralA3 }]),
  value: StyleSheet.flatten([fontSemibold14]),
});
