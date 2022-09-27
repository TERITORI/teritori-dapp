// libraries
import React from "react";
import { StyleSheet, View } from "react-native";
import styled from "styled-components/native";

import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import { fontSemibold14 } from "../utils/style/fonts";
import { genericStyles } from "../utils/style/genericStyles";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { DivRow } from "./div";
import { TextInputCustom } from "./inputs/TextInputCustom";
import { SpacerRow } from "./spacer";

// misc

type PaginationProps = {
  currentPage: number;
  maxPage: number;
  itemsPerPage?: number;
};

export const Pagination = ({
  currentPage,
  maxPage,
  itemsPerPage,
}: PaginationProps) => {
  // variables

  // hooks

  // functions

  // returns
  return (
    <Container>
      <DivRow jc="center" ai="center">
        <GrayText>
          Page {currentPage} of {maxPage}
        </GrayText>
        <GrayText>|</GrayText>
        <GrayText>Go to page:</GrayText>
        <InputContainer>
          <TextInputCustom
            name="page"
            label=""
            variant="labelOutside"
            defaultValue={currentPage}
          />
        </InputContainer>
      </DivRow>

      <DivRow>
        <TertiaryBox height={42} width={56}>
          <SVG source={chevronLeftDoubleSVG} height={16} width={16} />
        </TertiaryBox>
        <SpacerRow size={0.5} />
        <TertiaryBox height={42} width={56}>
          <SVG source={chevronLeftSVG} height={16} width={16} />
        </TertiaryBox>

        <SpacerRow size={2} />
        <PrimaryButton text={currentPage.toString()} size="XS" width={56} />
        <SpacerRow size={1} />
        <SecondaryButton text={maxPage.toString()} size="XS" width={56} />
        <SpacerRow size={2} />

        <TertiaryBox height={42} width={56}>
          <SVG source={chevronRightSVG} height={16} width={16} />
        </TertiaryBox>
        <SpacerRow size={0.5} />
        <TertiaryBox height={42} width={56}>
          <SVG source={chevronRightDoubleSVG} height={16} width={16} />
        </TertiaryBox>
      </DivRow>

      <DivRow jc="center" ai="center">
        <GrayText>Items per page:</GrayText>
        <InputContainer>
          <TextInputCustom
            name="page"
            label=""
            variant="labelOutside"
            defaultValue={currentPage}
          />
        </InputContainer>
      </DivRow>
    </Container>
  );
};

const Container = styled.View(({ theme: { layout } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  paddingHorizontal: layout.padding_x2,
}));

const GrayText = styled.View(({ theme: { colors, layout } }) => ({
  ...(fontSemibold14 as object),
  color: colors.neutral77,
  paddingRight: layout.padding_x1,
  lineHeight: 14,
}));

const InputContainer = styled.View({
  width: 80,
});
