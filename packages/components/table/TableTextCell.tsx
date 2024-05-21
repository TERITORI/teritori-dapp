import React, { FC } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { TableCell } from "@/components/table/TableCell";
import { tableCellTextStyle } from "@/components/table/utils";

export const TableTextCell: FC<{
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: string;
}> = ({ children = "", style, textStyle }) => {
  return (
    <TableCell style={style}>
      <CellBrandText style={textStyle}>{children}</CellBrandText>
    </TableCell>
  );
};

export const CellBrandText: FC<{
  children?: string;
  style?: StyleProp<TextStyle>;
}> = ({ children = "", style }) => {
  return (
    <BrandText style={[tableCellTextStyle, style]} numberOfLines={1}>
      {children}
    </BrandText>
  );
};
