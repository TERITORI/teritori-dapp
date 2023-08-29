// libraries
import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

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
      style={[containerStyle, { opacity: disabled ? 0.5 : undefined }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={rowStyle}>
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

const containerStyle: ViewStyle = {
  borderRadius: 12,
  borderColor: neutral33,
  borderWidth: 1,
  padding: layout.padding_x2_5,
};
const rowStyle: ViewStyle = { flexDirection: "row", alignItems: "center" };
