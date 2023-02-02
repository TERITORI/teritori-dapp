import React from "react";
import { StyleSheet, View, TextStyle, useWindowDimensions } from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout, smallMobileWidth } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
  labelStyle?: TextStyle;
}

export const TableRow: React.FC<TableRowProps> = ({ headings, labelStyle }) => {
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      backgroundColor: codGrayColor,
      minHeight: layout.contentPadding,
      paddingHorizontal:
        width < smallMobileWidth ? layout.padding_x0_5 : layout.padding_x1,
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
            labelStyle,
          ]}
        >
          {label}
        </BrandText>
      ))}
    </View>
  );
};
