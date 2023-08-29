import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";

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
    <View style={containerStyle}>
      <BrandText style={titleStyle}>{title}</BrandText>
      <SpacerColumn size={0.5} />
      {typeof value === "string" ? (
        <BrandText style={fontSemibold14}>{value}</BrandText>
      ) : (
        value && value()
      )}
    </View>
  );
};

const containerStyle: ViewStyle = {
  backgroundColor: neutral17,
  padding: layout.padding_x1_5,
};
const titleStyle: TextStyle = {
  ...fontSemibold12,
  color: neutralA3,
};
