import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { TertiaryBox } from "../boxes/TertiaryBox";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
  labelStyle?: TextStyle;
  showBrokenCorner?: boolean;
  style?: ViewStyle;
}

export const TableRow: React.FC<TableRowProps> = ({
  headings,
  labelStyle,
  showBrokenCorner = false,
  style,
}) => {
  return (
    <TertiaryBox
      noBrokenCorners={!showBrokenCorner}
      mainContainerStyle={[styles.row, style]}
      fullWidth
    >
      {headings.map(({ label, flex }, index) => (
        <BrandText
          key={label}
          style={[
            styles.labelText,
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
    </TertiaryBox>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: codGrayColor,
    minHeight: layout.contentPadding,
    paddingHorizontal: layout.padding_x2_5,
    borderTopLeftRadius: layout.borderRadius,
    borderTopRightRadius: layout.borderRadius,
  },
  labelText: StyleSheet.flatten([
    fontSemibold12,
    {
      color: secondaryColor,
      opacity: 0.4,
    },
  ]),
});
