import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { neutral33, neutral55, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { LocalFileData } from "../../utils/types/files";
import { AssetsPagination } from "../AssetsPagination";
import { BrandText } from "../BrandText";
import { Box } from "../boxes/Box";
import { PrimaryBox } from "../boxes/PrimaryBox";
import { SpacerColumn } from "../spacer";

export const SelectedFilesPreview: React.FC<{
  assets: LocalFileData[];
  onSelect: (item: LocalFileData) => void;
}> = ({ assets, onSelect }) => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageIndex, setPageIndex] = useState(0);
  const total = assets?.length || 28;

  const maxPage = Math.max(Math.ceil(total / itemsPerPage), 1);

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "flex-end" }}>
        {assets.length > 0 ? (
          <>
            <View style={{ flexDirection: "row" }}>
              {assets.map((item, index) => (
                <TouchableOpacity
                  style={{
                    height: 123,
                    width: 100,
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    onSelect(item);
                  }}
                >
                  <Box
                    style={{
                      width: 100,
                      height: 100,
                      borderWidth: 1,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(item.file)}
                      style={{
                        height: 100,
                        width: 100,
                      }}
                      alt="Uploaded file"
                    />
                  </Box>
                  <PrimaryBox
                    style={{
                      borderRadius: 32,
                      height: 34,
                      width: 52,
                      top: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                    }}
                  >
                    <BrandText
                      style={[fontSemibold13, { color: secondaryColor }]}
                    >
                      {index + 1}
                    </BrandText>
                  </PrimaryBox>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
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
        )}
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
