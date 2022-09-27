import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import styled from "styled-components/native";

import { fontSemibold12 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { BrandText } from "../BrandText";

export type TableRowHeading = { label: string; flex: number };

interface TableRowProps {
  headings: TableRowHeading[];
  labelStyle?: TextStyle;
}

export const TableRow: React.FC<TableRowProps> = ({ headings, labelStyle }) => {
  return (
    <Row>
      {headings.map(({ label, flex }, index) => (
        <LabelText
          key={label}
          flex={flex}
          isLast={headings.length - 1 === index}
          style={labelStyle}
        >
          {label}
        </LabelText>
      ))}
    </Row>
  );
};

const Row = styled.View(({ theme: { layout, colors } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  width: "100%",
  backgroundColor: colors.codGray,
  minHeight: layout.contentPadding,
  paddingHorizontal: layout.padding_x2_5,
  borderTopLeftRadius: layout.borderRadius,
  borderTopRightRadius: layout.borderRadius,
}));

const LabelText = styled(BrandText)<{ flex: number; isLast: boolean }>(
  ({ theme: { colors, layout }, flex, isLast }) => ({
    ...(fontSemibold12 as object),
    color: colors.secondary,
    opacity: 0.4,
    flex,
    paddingRight: isLast ? 0 : layout.padding_x1,
  })
);
