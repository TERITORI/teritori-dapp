import React, { FC, ReactNode, useState } from "react";
import { ScrollView, View } from "react-native";

import { Pagination, PaginationProps } from "@/components/Pagination";
import { SpacerColumn } from "@/components/spacer";

export const TableWrapper: FC<{
  children: ReactNode;
  paginationProps: PaginationProps;
  showPagination?: boolean;
  horizontalScrollBreakpoint?: number;
}> = ({
  children,
  paginationProps,
  showPagination,
  horizontalScrollBreakpoint = 0,
}) => {
  const [viewWidth, setViewWidth] = useState(0);

  return (
    <View onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: "100%" }}
      >
        <View
          style={viewWidth >= horizontalScrollBreakpoint && { width: "100%" }}
        >
          {children}
        </View>
      </ScrollView>

      {showPagination && (
        <>
          <SpacerColumn size={2} />
          <Pagination {...paginationProps} />
          <SpacerColumn size={2} />
        </>
      )}
    </View>
  );
};
