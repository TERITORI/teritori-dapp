import React from "react";
import {
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
    <View style={rowCStyle}>
      {entries.map(([key, { label, flex }], index) => {
        const containerStyle: ViewStyle = {
          flex,
          paddingRight: entries.length - 1 === index ? 0 : layout.spacing_x1,
        };
        const content = (
          <BrandText
            style={[
              fontSemibold12,
              {
                ...fontSemibold12,
                color: secondaryColor,
                opacity: 0.4,
              },
              labelStyle,
            ]}
            numberOfLines={1}
          >
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

export const TableCell: React.FC<{
  children: React.ReactNode;
  flex: number;
  isLast: boolean;
}> = ({ children, flex, isLast }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          flex,
          paddingRight: isLast ? 0 : layout.spacing_x1,
        },
      ]}
    >
      {children}
    </View>
  );
};

const rowCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  backgroundColor: codGrayColor,
  minHeight: layout.contentSpacing,
  paddingHorizontal: layout.spacing_x2_5,
  borderTopLeftRadius: layout.borderRadius,
  borderTopRightRadius: layout.borderRadius,
};
