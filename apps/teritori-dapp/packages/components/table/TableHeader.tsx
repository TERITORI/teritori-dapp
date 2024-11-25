import React, { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import {
  TableColumns,
  tableColumnsGap,
  tableHeaderHeight,
  tableHeaderTextStyle,
  tablePaddingHorizontal,
} from "@/components/table/utils";
import {
  codGrayColor,
  mineShaftColor,
  secondaryColor,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

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
          height: tableHeaderHeight,
          borderTopLeftRadius: layout.borderRadius,
          borderTopRightRadius: layout.borderRadius,
          borderBottomColor: mineShaftColor,
          borderBottomWidth: 1,
          paddingHorizontal: tablePaddingHorizontal,
        },
        style,
      ]}
    >
      {Object.entries(columns).map(
        ([key, { label, minWidth, flex }], index) => (
          <View
            style={{
              flex,
              marginRight: tableColumnsGap,
              minWidth,
            }}
            key={index}
          >
            <BrandText
              style={[
                tableHeaderTextStyle,
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
