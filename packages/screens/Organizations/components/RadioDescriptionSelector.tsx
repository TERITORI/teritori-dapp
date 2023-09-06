import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RadioButton } from "../../../components/RadioButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const RadioDescriptionSelector: React.FC<{
  disabled?: boolean;
  selected: boolean;
  onPress: () => void;
  title: string;
  description: string;
}> = ({ selected, disabled, onPress, title, description }) => {
  return (
    <Pressable
      style={[styles.container, { opacity: disabled ? 0.5 : undefined }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.row}>
        <RadioButton selected={selected} />
        <SpacerRow size={2.5} />
        <BrandText style={fontSemibold16}>{title}</BrandText>
      </View>
      <SpacerColumn size={2.5} />
      <BrandText style={[fontMedium13, { color: neutralA3 }]}>
        {description}
      </BrandText>
    </Pressable>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    padding: layout.spacing_x2_5,
  },
  row: { flexDirection: "row", alignItems: "center" },
});
