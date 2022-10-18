import React from "react";
import { Pressable, StyleSheet, TextStyle, View } from "react-native";

import { mineShaftColor, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";

export type TableRowDataItem<T = any> = {
  uid: string;
  keyId: keyof T;
  value?: string;
  flex: number;
};

interface TableRowDataProps {
  data: TableRowDataItem[];
  specialRender?: (item: TableRowDataItem) => React.ReactNode;
  onPress?: () => void;
  labelStyle?: TextStyle;
}

export const TableRowData: React.FC<TableRowDataProps> = ({
  data,
  specialRender,
  onPress,
  labelStyle,
}) => {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      {data.map(({ value, flex, keyId, uid }, index) => (
        <View
          key={value}
          style={{
            flex,
            paddingRight: data.length - 1 === index ? 0 : layout.padding_x1,
          }}
        >
          {(specialRender && specialRender({ value, flex, keyId, uid })) || (
            <BrandText style={[styles.labelText, labelStyle]}>
              {value}
            </BrandText>
          )}
        </View>
      ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderColor: mineShaftColor,
    borderTopWidth: 1,
    paddingVertical: layout.padding_x2,
    paddingHorizontal: layout.padding_x2_5,
  },
  labelText: {
    ...StyleSheet.flatten(fontSemibold13),
    textTransform: "uppercase",
  },
  valueText: {
    ...StyleSheet.flatten(fontSemibold13),
    color: secondaryColor,
    textTransform: "uppercase",
  },
});
