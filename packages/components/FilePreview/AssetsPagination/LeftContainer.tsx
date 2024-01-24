import React from "react";
import { TextInput, View } from "react-native";

import { PaginationProps } from "./PaginationProps.type";
import { neutral17, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SEARCH_BAR_INPUT_HEIGHT } from "../../Search/SearchBarInput";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const LeftContainer = ({
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
