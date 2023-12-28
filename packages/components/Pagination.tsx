import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { LegacySecondaryBox } from "./boxes/LegacySecondaryBox";
import { LegacyTertiaryBox } from "./boxes/LegacyTertiaryBox";
import { SpacerRow } from "./spacer";
import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";
import { useClickOutside } from "../hooks/useClickOutside";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  itemsPerPage: number;
  dropdownOptions: number[];
  setItemsPerPage: (item: number) => void;
  onChangePage: (page: number) => void;
}

export const Pagination = ({
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

  const [isDropdownOpen, setDropdownState, dropdownRef] = useClickOutside();

  return (
    <View style={styles.container}>
      <View style={[styles.section, { justifyContent: "flex-start" }]}>
        <BrandText style={styles.grayText}>
          Page {currentPage + 1} of {maxPage}
        </BrandText>
      </View>

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

      <View
        style={[styles.section, { justifyContent: "flex-end" }]}
        ref={dropdownRef}
        collapsable={false}
      >
        <LegacyTertiaryBox height={42} width={80}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => setDropdownState(true)}
          >
            <BrandText
              style={[fontSemibold14, { marginRight: layout.spacing_x1 }]}
            >
              {itemsPerPage}
            </BrandText>
            <SVG
              source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </LegacyTertiaryBox>

        {isDropdownOpen && (
          <LegacySecondaryBox
            noBrokenCorners
            width={80}
            style={{ position: "absolute", top: 46, right: 0 }}
            mainContainerStyle={{
              paddingHorizontal: layout.spacing_x1_5,
              paddingTop: layout.spacing_x1_5,
              backgroundColor: neutral33,
              alignItems: "flex-start",
            }}
          >
            {dropdownOptions.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setItemsPerPage(item);
                  setDropdownState(false);
                }}
                key={index}
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: layout.spacing_x1_5,
                  },
                ]}
              >
                <BrandText
                  style={[fontSemibold13, { marginLeft: 12, color: neutralA3 }]}
                >
                  {item}
                </BrandText>
              </TouchableOpacity>
            ))}
          </LegacySecondaryBox>
        )}
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
