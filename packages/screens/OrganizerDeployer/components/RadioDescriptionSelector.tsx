// libraries
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RadioButton } from "../../../components/RadioButton";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { neutral33, neutralA3 } from "../../../utils/style/colors";
import { fontMedium13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
// misc

type RadioDescriptionSelectorProps = {
  selected: boolean;
  onPress: () => void;
  title: string;
  description: string;
};

export const RadioDescriptionSelector = ({
  selected,
  onPress,
  title,
  description,
}: RadioDescriptionSelectorProps) => {
  // variables

  // returns
  return (
    <Pressable style={styles.container} onPress={onPress}>
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    padding: layout.padding_x2_5,
  },
  row: { flexDirection: "row", alignItems: "center" },
});
