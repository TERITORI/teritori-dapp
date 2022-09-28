import React from "react";
import { StyleSheet, View } from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
}

export const TableRow: React.FC<TableRowProps> = ({ headings }) => {
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
                headings.length - 1 === index ? 0 : layout.padding_x1,
            },
          ]}
        >
          {label}
        </BrandText>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
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
      textTransform: "uppercase",
    },
  ]),
});
