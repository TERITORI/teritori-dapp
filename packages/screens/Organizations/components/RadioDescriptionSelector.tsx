// libraries
import React, { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RadioButton } from "../../../components/RadioButton";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const RadioDescriptionSelector: React.FC<{
  disabled?: boolean;
  selected: boolean;
  onPress: () => void;
  title: string;
  description: string;
  style?: StyleProp<ViewStyle>;
}> = ({ selected, disabled, onPress, title, description, style }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <CustomPressable
      style={[
        styles.container,
        disabled && { opacity: 0.5 },
        hovered && { borderColor: secondaryColor },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
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
    </CustomPressable>
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
