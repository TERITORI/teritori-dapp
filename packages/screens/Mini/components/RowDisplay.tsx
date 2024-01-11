import React, { ReactNode } from "react";
import { View, ViewStyle, StyleProp, TextStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { neutral22, neutralA3 } from "../../../utils/style/colors";
import { fontBold16, fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type RowDisplayProps = {
  leftLabel?: string | ReactNode;
  rightLabel?: string | ReactNode;
  style?: StyleProp<ViewStyle>;
  rightLabelStyle?: StyleProp<TextStyle>;
  leftLabelStyle?: StyleProp<TextStyle>;
};

export default function RowDisplay({
  leftLabel,
  rightLabel,
  style,
  leftLabelStyle,
  rightLabelStyle,
}: RowDisplayProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: layout.spacing_x2,
          borderRadius: 14,
          backgroundColor: neutral22,
        },
        style,
      ]}
    >
      {typeof leftLabel === "string" ? (
        <BrandText style={[fontMedium16, { color: neutralA3 }, leftLabelStyle]}>
          {leftLabel}
        </BrandText>
      ) : (
        leftLabel
      )}

      {typeof rightLabel === "string" ? (
        <BrandText style={[fontBold16, rightLabelStyle]}>
          {rightLabel}
        </BrandText>
      ) : (
        rightLabel
      )}
    </View>
  );
}
