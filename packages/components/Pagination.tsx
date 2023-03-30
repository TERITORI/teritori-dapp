// libraries
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
import { TextInputCustom } from "./inputs/TextInputCustom";
import { SpacerRow } from "./spacer";

// misc

type PaginationProps = {
  currentPage: number;
  maxPage: number;
  itemsPerPage: number;
  onChangePage: (page: number) => void;
  disableLastButton?: boolean;
};

export const Pagination = ({
  currentPage,
  maxPage,
  itemsPerPage,
  onChangePage,
  disableLastButton,
}: PaginationProps) => {
  const handleChangePage = (pageIndex: number) => {
    if (pageIndex < 0) {
      pageIndex = 0;
    } else if (pageIndex >= maxPage) {
      pageIndex = maxPage - 1;
    }
    if (pageIndex !== currentPage) {
      onChangePage(pageIndex);
    }
  };

  const edgeSectionsWidth = 250; // this is needed to make sure the pagination arrows are centered and don't move

  // returns
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.section,
          { width: edgeSectionsWidth, justifyContent: "flex-start" },
        ]}
      >
        <BrandText style={styles.grayText}>
          Page {currentPage + 1} of {maxPage}
        </BrandText>
      </View>

      <View style={styles.section}>
        <TouchableOpacity onPress={() => handleChangePage(0)}>
          <TertiaryBox height={42} width={56}>
            <SVG source={chevronLeftDoubleSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={0.5} />
        <TouchableOpacity onPress={() => handleChangePage(currentPage - 1)}>
          <TertiaryBox height={42} width={56}>
            <SVG source={chevronLeftSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={2} />
        <TouchableOpacity onPress={() => handleChangePage(currentPage + 1)}>
          <TertiaryBox height={42} width={56}>
            <SVG source={chevronRightSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={0.5} />
        {!disableLastButton && (
          <TouchableOpacity onPress={() => handleChangePage(maxPage - 1)}>
            <TertiaryBox height={42} width={56}>
              <SVG source={chevronRightDoubleSVG} height={16} width={16} />
            </TertiaryBox>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.section,
          { width: edgeSectionsWidth, justifyContent: "flex-end" },
        ]}
      >
        <BrandText style={styles.grayText}>Items per page:</BrandText>
        <TextInputCustom<{ items: number }>
          width={80}
          name="items"
          label=""
          variant="labelOutside"
          value={itemsPerPage.toString()}
        />
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
});
