import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { useIsMobile } from "@/hooks/useIsMobile";
import { codGrayColor, secondaryColor } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface TableColumns {
  [key: string]: { label: string; minWidth: number; flex: number };
}

export const TableHeaderNew: FC<{
  columns: TableColumns;
  style?: StyleProp<ViewStyle>;
}> = ({ columns, style }) => {
  const isMobile = useIsMobile();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: codGrayColor,
          minHeight: layout.contentSpacing,
          borderTopLeftRadius: layout.borderRadius,
          borderTopRightRadius: layout.borderRadius,
        },
        style,
      ]}
    >
      {Object.entries(columns).map(
        ([key, { label, minWidth, flex }], index) => (
          <View
            style={{
              flex,
              marginRight: layout.spacing_x1,
              minWidth: minWidth * (isMobile ? 0.9 : 1),
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
