import React from "react";
import { StyleSheet, View, TextStyle } from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

import { useIsMobile } from "@/hooks/useIsMobile";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
  labelStyle?: TextStyle;
}

export const TableRow: React.FC<TableRowProps> = ({ headings, labelStyle }) => {
  const isMobile = useIsMobile();

  return (
    <View style={styles.row}>
      {headings.map(({ label, flex }, index) => (
        <BrandText
          key={label}
          style={[
            styles.labelText,
            {
              flex,
              paddingRight:
                headings.length - 1 === index
                  ? isMobile
                    ? 0
                    : layout.spacing_x1
                  : 0,
            },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </BrandText>
      ))}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: codGrayColor,
    minHeight: layout.contentSpacing,
    paddingHorizontal: layout.spacing_x1_25,
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
