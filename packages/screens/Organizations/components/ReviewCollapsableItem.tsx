import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { neutral17, neutralA3 } from "@/utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

interface ReviewCollapsableItemProps {
  title: string;
  value: string | (() => React.ReactNode) | undefined;
}

export const ReviewCollapsableItem: React.FC<ReviewCollapsableItemProps> = ({
  title,
  value,
}) => {
  return (
    <View style={containerCStyle}>
      <BrandText style={titleCStyle}>{title}</BrandText>
      <SpacerColumn size={0.5} />
      {typeof value === "string" ? (
        <BrandText style={valueCStyle}>{value}</BrandText>
      ) : (
        value && value()
      )}
    </View>
  );
};

const containerCStyle: ViewStyle = {
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
};

const titleCStyle: TextStyle = {
  ...fontSemibold12,
  color: neutralA3,
};

const valueCStyle: TextStyle = {
  ...fontSemibold14,
};
