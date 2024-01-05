import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SEARCH_BAR_INPUT_HEIGHT } from "./Search/SearchBarInput";
import { Box } from "./boxes/Box";
import { LegacyTertiaryBox } from "./boxes/LegacyTertiaryBox";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SpacerRow } from "./spacer";
import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import {
  neutral17,
  neutral33,
  neutral77,
  primaryColor,
} from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  itemsPerPage: number;
  dropdownOptions: number[];
  setItemsPerPage: (item: number) => void;
  onChangePage: (page: number) => void;
}

export const AssetsPagination = ({
  currentPage,
  maxPage,
  dropdownOptions,
  itemsPerPage,
  setItemsPerPage,
  onChangePage,
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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={[styles.section, { justifyContent: "flex-start" }]}>
          <BrandText style={styles.grayText}>
            Page {currentPage + 1} of {maxPage}
          </BrandText>
        </View>
        <View style={[styles.section, { justifyContent: "flex-start" }]}>
          <BrandText style={styles.grayText}>| Go to page:</BrandText>
          <TertiaryBox
            style={[
              {
                flexDirection: "row",
                paddingHorizontal: layout.spacing_x1_5,
                backgroundColor: neutral17,
                width: 80,
                height: SEARCH_BAR_INPUT_HEIGHT,
                alignItems: "center",
              },
            ]}
          >
            <TextInput
              value={currentPage.toString()}
              inputMode="numeric"
              style={[
                fontSemibold14,
                {
                  color: "white",
                  flex: 1,
                  width: 56,
                },
                { outlineStyle: "none" } as any,
              ]}
              onChangeText={(text) => {
                handleChangePage(+text);
              }}
            />
          </TertiaryBox>
        </View>
      </View>

      <SpacerRow size={1} />

      <View style={{ flex: 1 }}>
        <View style={styles.section}>
          <TouchableOpacity onPress={() => handleChangePage(0)}>
            <LegacyTertiaryBox height={42} width={56}>
              <SVG source={chevronLeftDoubleSVG} height={16} width={16} />
            </LegacyTertiaryBox>
          </TouchableOpacity>

          <SpacerRow size={1} />

          <TouchableOpacity onPress={() => handleChangePage(currentPage - 1)}>
            <LegacyTertiaryBox height={42} width={56}>
              <SVG source={chevronLeftSVG} height={16} width={16} />
            </LegacyTertiaryBox>
          </TouchableOpacity>

          <SpacerRow size={2} />

          <View style={[styles.section, { justifyContent: "flex-end" }]}>
            <Box
              notched
              style={{
                height: 42,
                width: 80,
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: primaryColor,
                borderColor: neutral33,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                activeOpacity={1}
                disabled
              >
                <BrandText
                  style={[fontSemibold14, { marginRight: layout.spacing_x1 }]}
                >
                  {maxPage}
                </BrandText>
              </TouchableOpacity>
            </Box>
          </View>
          <SpacerRow size={2} />

          <TouchableOpacity onPress={() => handleChangePage(currentPage + 1)}>
            <LegacyTertiaryBox height={42} width={56}>
              <SVG source={chevronRightSVG} height={16} width={16} />
            </LegacyTertiaryBox>
          </TouchableOpacity>

          <SpacerRow size={1} />

          <TouchableOpacity onPress={() => handleChangePage(maxPage - 1)}>
            <LegacyTertiaryBox height={42} width={56}>
              <SVG source={chevronRightDoubleSVG} height={16} width={16} />
            </LegacyTertiaryBox>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: layout.spacing_x2,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  grayText: {
    ...fontSemibold14,
    color: neutral77,
    paddingRight: layout.spacing_x1,
    lineHeight: 14,
  },
});
