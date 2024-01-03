import React, { useState } from "react";
import { View } from "react-native";

import { useIsMobile } from "../../hooks/useIsMobile";
import { neutral33, neutral55 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { AssetsPagination } from "../AssetsPagination";
import { BrandText } from "../BrandText";
import { Box } from "../boxes/Box";
import { SpacerColumn } from "../spacer";

export const SelectedFilesPreview: React.FC<{
  assets?: string[];
}> = ({ assets }) => {
  const isMobile = useIsMobile();
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const total = assets?.length || 28;
  if (isMobile) {
    return null;
  }
  const maxPage = Math.max(Math.ceil(total / itemsPerPage), 1);
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "flex-end" }}>
        <Box
          style={{
            height: 267,
            width: "100%",
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            borderColor: neutral33,
          }}
        >
          <BrandText style={[fontSemibold20, { color: neutral55 }]}>
            Select assets to preview
          </BrandText>
        </Box>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          flex: 1,
        }}
      >
        <AssetsPagination
          currentPage={pageIndex}
          maxPage={maxPage}
          itemsPerPage={itemsPerPage}
          dropdownOptions={[50, 100, 200]}
          setItemsPerPage={setItemsPerPage}
          onChangePage={setPageIndex}
        />
        <SpacerColumn size={2} />
      </View>
    </View>
  );
};
