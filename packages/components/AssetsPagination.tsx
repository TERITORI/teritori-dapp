import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SEARCH_BAR_INPUT_HEIGHT } from "./Search/SearchBarInput";
import { Box } from "./boxes/Box";
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
  setItemsPerPage: (item: number) => void;
  onChangePage: (page: number) => void;
}

export const AssetsPagination = ({
  currentPage,
  maxPage,
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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingHorizontal: layout.spacing_x2,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <BrandText
            style={{
              ...fontSemibold14,
              color: neutral77,
              paddingRight: layout.spacing_x1,
              lineHeight: 14,
            }}
          >
            Page {currentPage + 1} of {maxPage}
          </BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <BrandText
            style={{
              ...fontSemibold14,
              color: neutral77,
              paddingRight: layout.spacing_x1,
              lineHeight: 14,
            }}
          >
            | Go to page:
          </BrandText>
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
              value={(currentPage + 1).toString()}
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={() => handleChangePage(0)}>
            <TertiaryBox
              style={{
                height: 42,
                width: 56,
                alignItems: "center",
                justifyContent: "center",
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronLeftSVG} height={16} width={16} />
            </TertiaryBox>
          </TouchableOpacity>

          <SpacerRow size={2} />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
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
                  {currentPage + 1}
                </BrandText>
              </TouchableOpacity>
            </Box>
          </View>
          <SpacerRow size={2} />

          <TouchableOpacity onPress={() => handleChangePage(currentPage + 1)}>
            <TertiaryBox
              style={{
                height: 42,
                width: 56,
                alignItems: "center",
                justifyContent: "center",
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
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SVG source={chevronRightDoubleSVG} height={16} width={16} />
            </TertiaryBox>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
