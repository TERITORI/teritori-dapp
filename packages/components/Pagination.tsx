import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SecondaryBox } from "./boxes/SecondaryBox";
import { SpacerRow } from "./spacer";
import chevronDownSVG from "../../assets/icons/chevron-down.svg";
import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import chevronUpSVG from "../../assets/icons/chevron-up.svg";

import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { useDropdowns } from "@/hooks/useDropdowns";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import { fontRegular13, fontRegular14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export interface PaginationProps {
  currentPage: number;
  maxPage: number;
  itemsPerPage: number;
  nbItemsOptions: number[];
  setItemsPerPage: (item: number) => void;
  onChangePage: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  maxPage,
  nbItemsOptions,
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
  const [isDropdownOpen, setDropdownState, dropdownRef] = useDropdowns();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: layout.spacing_x2,
      }}
    >
      <View style={[sectionCStyle, { justifyContent: "flex-start" }]}>
        <BrandText
          style={[
            fontRegular14,
            {
              color: neutral77,
              paddingRight: layout.spacing_x1,
            },
          ]}
        >
          Page {currentPage + 1} of {maxPage}
        </BrandText>
      </View>

      <View style={sectionCStyle}>
        <TouchableOpacity onPress={() => handleChangePage(0)}>
          <TertiaryBox
            style={{
              height: 42,
              width: 56,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={chevronLeftDoubleSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={1} />
        <TouchableOpacity onPress={() => handleChangePage(currentPage - 1)}>
          <TertiaryBox
            style={{
              height: 42,
              width: 56,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={chevronLeftSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={2} />
        <TouchableOpacity onPress={() => handleChangePage(currentPage + 1)}>
          <TertiaryBox
            style={{
              height: 42,
              width: 56,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={chevronRightSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
        <SpacerRow size={1} />
        <TouchableOpacity onPress={() => handleChangePage(maxPage - 1)}>
          <TertiaryBox
            style={{
              height: 42,
              width: 56,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SVG source={chevronRightDoubleSVG} height={16} width={16} />
          </TertiaryBox>
        </TouchableOpacity>
      </View>

      <View
        style={[sectionCStyle, { justifyContent: "flex-end" }]}
        ref={dropdownRef}
        collapsable={false}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDropdownState(!isDropdownOpen)}
        >
          <TertiaryBox
            style={{
              height: 42,
              width: 80,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BrandText
                style={[fontRegular14, { marginRight: layout.spacing_x1 }]}
              >
                {itemsPerPage}
              </BrandText>
              <SVG
                source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
                width={16}
                height={16}
                color={secondaryColor}
              />
            </View>
          </TertiaryBox>
        </TouchableOpacity>

        {isDropdownOpen && (
          <SecondaryBox
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              width: 80,
              paddingHorizontal: layout.spacing_x1_5,
              paddingTop: layout.spacing_x1_5,
              backgroundColor: neutral33,
              alignItems: "flex-start",
            }}
          >
            {nbItemsOptions.map((nbItems, index) => (
              <TouchableOpacity
                onPress={() => {
                  setItemsPerPage(nbItems);
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
                  style={[
                    fontRegular13,
                    { marginLeft: layout.spacing_x1_5, color: neutralA3 },
                  ]}
                >
                  {nbItems}
                </BrandText>
              </TouchableOpacity>
            ))}
          </SecondaryBox>
        )}
      </View>
    </View>
  );
};

const sectionCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};
