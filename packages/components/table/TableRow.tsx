import React from "react";
import { View, TextStyle, ViewStyle } from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
  labelStyle?: TextStyle;
}

export const TableRow: React.FC<TableRowProps> = ({ headings, labelStyle }) => {
  return (
    <View style={rowStyle}>
      {headings.map(({ label, flex }, index) => (
        <BrandText
          key={label}
          style={[
            labelTextStyle,
            {
              flex,
              paddingRight:
                headings.length - 1 === index ? 0 : layout.padding_x1,
            },
            labelStyle,
          ]}
        >
          {label}
        </BrandText>
      ))}
    </View>
  );
};

const rowStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  backgroundColor: codGrayColor,
  minHeight: layout.contentPadding,
  paddingHorizontal: layout.padding_x2_5,
  borderTopLeftRadius: layout.borderRadius,
  borderTopRightRadius: layout.borderRadius,
};
const labelTextStyle: TextStyle = {
  ...fontSemibold12,
  color: secondaryColor,
  opacity: 0.4,
};
