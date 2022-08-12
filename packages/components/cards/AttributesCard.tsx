import React from "react";
import { ViewStyle } from "react-native";

import { neutral77 } from "../../utils/style/colors";
import { fontMedium14, fontSemibold12 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { SecondaryCard } from "./SecondaryCard";

export const AttributesCard: React.FC<{
  style?: ViewStyle;
  label: string;
  value: string;
}> = ({ style, label, value }) => {
  return (
    <SecondaryCard
      style={style}
      width={132}
      height={62}
      paddingH={12}
      paddingV={14}
    >
      <BrandText
        style={[fontSemibold12, { color: neutral77, marginBottom: 6 }]}
      >
        {label}
      </BrandText>
      <BrandText style={fontMedium14}>{value}</BrandText>
    </SecondaryCard>
  );
};
