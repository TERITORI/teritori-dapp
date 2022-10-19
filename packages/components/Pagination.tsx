// libraries
import React from "react";
import { StyleSheet, View } from "react-native";

import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import { neutral77 } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { TextInputCustom } from "./inputs/TextInputCustom";
import { SpacerRow } from "./spacer";

// misc

type PaginationProps = {
  currentPage: number;
  maxPage: number;
  itemsPerPage: number;
};

export const Pagination = ({
  currentPage,
  maxPage,
  itemsPerPage,
}: PaginationProps) => {
  // returns
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <BrandText style={styles.grayText}>
          Page {currentPage} of {maxPage}
        </BrandText>
        <BrandText style={styles.grayText}>|</BrandText>
        <BrandText style={styles.grayText}>Go to page:</BrandText>
        <View style={styles.inputContainer}>
          <TextInputCustom<{ page: string }>
            name="page"
            label=""
            variant="labelOutside"
            defaultValue={currentPage.toString()}
          />
        </View>
      </View>

      <View style={styles.section}>
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
      </View>

      <View style={styles.section}>
        <BrandText style={styles.grayText}>Items per page:</BrandText>
        <View style={styles.inputContainer}>
          <TextInputCustom<{ page: string }>
            name="page"
            label=""
            variant="labelOutside"
            defaultValue={itemsPerPage.toString()}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x2,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  grayText: {
    ...(fontSemibold14 as object),
    color: neutral77,
    paddingRight: layout.padding_x1,
    lineHeight: 14,
  },
  inputContainer: {
    width: 80,
  },
});
