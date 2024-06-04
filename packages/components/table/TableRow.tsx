import React from "react";
import {
  StyleSheet,
  View,
  TextStyle,
  Pressable,
  ColorValue,
  ViewStyle,
} from "react-native";

import { codGrayColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: { [key: string]: TableRowHeading };
  labelStyle?: TextStyle;
  allowSelect?: string[];
  onPressItem?: (key: string) => void;
  selectedColor?: ColorValue;
}

export const TableRow: React.FC<TableRowProps> = ({
  headings,
  labelStyle,
  allowSelect = [],
  onPressItem,
}) => {
  const entries = Object.entries(headings);
  return (
    <View style={styles.row}>
      {entries.map(([key, { label, flex }], index) => {
        const containerStyle: ViewStyle = {
          flex,
          paddingRight: entries.length - 1 === index ? 0 : layout.spacing_x1,
        };
        const content = (
          <BrandText style={[styles.labelText, labelStyle]} numberOfLines={1}>
            {label}
          </BrandText>
        );
        if (onPressItem && allowSelect.includes(key)) {
          return (
            <Pressable
              style={containerStyle}
              key={key}
              onPress={() => onPressItem(key)}
            >
              {content}
            </Pressable>
          );
        }
        return (
          <View style={containerStyle} key={key}>
            {content}
          </View>
        );
      })}
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
    paddingHorizontal: layout.spacing_x2_5,
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
