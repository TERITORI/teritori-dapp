import React, { ReactNode } from "react";
import { StyleProp, TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { neutral22, neutralA3 } from "../../../../utils/style/colors";
import { fontBold16, fontMedium15 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type MiniTableRowProps = {
  leftLabel?: string | ReactNode;
  rightLabel?: string | ReactNode;
  style?: StyleProp<ViewStyle>;
  rightLabelStyle?: StyleProp<TextStyle>;
  leftLabelStyle?: StyleProp<TextStyle>;
};

export default function MiniTableRow({
  leftLabel,
  rightLabel,
  style,
  leftLabelStyle,
  rightLabelStyle,
}: MiniTableRowProps) {
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
        <BrandText style={[fontMedium15, { color: neutralA3 }, leftLabelStyle]}>
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
