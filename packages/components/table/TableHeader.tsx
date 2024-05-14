import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { codGrayColor, secondaryColor } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface TableColumns {
  [key: string]: { label: string; flex: number; minWidth?: number };
}

export const TableHeader: FC<{
  columns: TableColumns;
  style?: StyleProp<ViewStyle>;
}> = ({ columns, style }) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: codGrayColor,
          minHeight: layout.contentSpacing,
          borderTopLeftRadius: layout.borderRadius,
          borderTopRightRadius: layout.borderRadius,
        },
        style,
      ]}
    >
      {Object.entries(columns).map(
        ([key, { label, minWidth = 0, flex }], index) => (
          <View
            style={{
              flex,
              marginRight: layout.spacing_x1,
              minWidth,
            }}
            key={index}
          >
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: secondaryColor,
                  opacity: 0.4,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </BrandText>
          </View>
        ),
      )}
    </View>
  );
};
