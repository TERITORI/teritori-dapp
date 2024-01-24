import React from "react";
import { View } from "react-native";

import { LeftContainer } from "./LeftContainer";
import { PaginationProps } from "./PaginationProps.type";
import { RightContainer } from "./RightContainer";
import { layout } from "../../../utils/style/layout";
import { SpacerRow } from "../../spacer";

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
