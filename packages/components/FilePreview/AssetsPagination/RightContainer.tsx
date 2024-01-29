import React from "react";
import { TouchableOpacity, View } from "react-native";

import { PaginationProps } from "./PaginationProps.type";
import chevronLeftDoubleSVG from "../../../../assets/icons/chevron-left-double.svg";
import chevronLeftSVG from "../../../../assets/icons/chevron-left.svg";
import chevronRightDoubleSVG from "../../../../assets/icons/chevron-right-double.svg";
import chevronRightSVG from "../../../../assets/icons/chevron-right.svg";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { SpacerRow } from "../../spacer";

export const RightContainer = ({
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
