import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SEARCH_BAR_INPUT_HEIGHT } from "./Search/SearchBarInput";
import { TertiaryBox } from "./boxes/TertiaryBox";
import { SpacerRow } from "./spacer";
import chevronLeftDoubleSVG from "../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../assets/icons/chevron-right.svg";
import { neutral17, neutral77, primaryColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";

interface PaginationProps {
  currentPage: number;
  maxPage: number;
  onChangePage: (page: number) => void;
}

const LeftContainer = ({
  currentPage,
  maxPage,
  onChangePage,
}: PaginationProps) => {
  return (
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
            defaultValue={(currentPage + 1).toString()}
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
            onSubmitEditing={(value) => {
              onChangePage(+value.nativeEvent.text - 1);
            }}
          />
        </TertiaryBox>
      </View>
    </View>
  );
};

const RightContainer = ({
  currentPage,
  maxPage,
  onChangePage,
}: PaginationProps) => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => onChangePage(0)}>
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

        <TouchableOpacity onPress={() => onChangePage(currentPage - 1)}>
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
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
              onChangePage(
                currentPage + 1 >= maxPage ? currentPage - 1 : currentPage,
              );
            }}
          >
            <TertiaryBox
              style={{
                height: 42,
                width: 56,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: primaryColor,
              }}
            >
              <BrandText style={fontSemibold14}>
                {currentPage + 1 >= maxPage ? currentPage : currentPage + 1}
              </BrandText>
            </TertiaryBox>
          </TouchableOpacity>
        </View>
        <SpacerRow size={2} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => {
              onChangePage(
                currentPage + 2 > maxPage ? currentPage : currentPage + 1,
              );
            }}
          >
            <TertiaryBox
              style={{
                height: 42,
                width: 56,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: primaryColor,
              }}
            >
              <BrandText style={fontSemibold14}>
                {currentPage + 2 > maxPage ? maxPage : currentPage + 2}
              </BrandText>
            </TertiaryBox>
          </TouchableOpacity>
        </View>
        <SpacerRow size={2} />

        <TouchableOpacity onPress={() => onChangePage(currentPage + 1)}>
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

        <TouchableOpacity onPress={() => onChangePage(maxPage - 1)}>
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
  );
};

export const AssetsPagination = ({
  currentPage,
  maxPage,
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
      <LeftContainer
        currentPage={currentPage}
        maxPage={maxPage}
        onChangePage={handleChangePage}
      />

      <SpacerRow size={1} />

      <RightContainer
        currentPage={currentPage}
        maxPage={maxPage}
        onChangePage={handleChangePage}
      />
    </View>
  );
};
