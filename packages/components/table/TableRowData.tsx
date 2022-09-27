import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import styled from "styled-components/native";

import { fontSemibold13 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
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
    <Row onPress={onPress}>
      {data.map(({ value, flex, keyId, uid }, index) => (
        <ItemContainer
          key={value}
          flex={flex}
          isLast={data.length - 1 === index}
        >
          {(specialRender && specialRender({ value, flex, keyId, uid })) || (
            <LabelText style={labelStyle}>{value}</LabelText>
          )}
        </ItemContainer>
      ))}
    </Row>
  );
};

const Row = styled.Pressable(({ theme: { layout, colors } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  width: "100%",
  borderColor: colors.mineShaft,
  borderTopWidth: 1,
  paddingVertical: layout.padding_x2,
  paddingHorizontal: layout.padding_x2_5,
}));

const ItemContainer = styled.View<{ flex: number; isLast: boolean }>(
  ({ theme: { layout }, flex, isLast }) => ({
    flex,
    paddingRight: isLast ? 0 : layout.padding_x1,
  })
);

const LabelText = styled(BrandText)(({ theme: { colors } }) => ({
  ...(fontSemibold13 as object),
  color: colors.secondary,
}));
