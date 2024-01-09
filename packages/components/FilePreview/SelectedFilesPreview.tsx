import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { neutral33, neutral55, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  const itemsPerPage = 14; // Number of items to display per page

  useEffect(() => {
    if (assets) {
      setTotalPage(Math.ceil(assets.length / itemsPerPage));
    }
  }, [assets]);

  const indexOfLastItem = currentPage * itemsPerPage + itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <View
      style={{
        width: 850,
        flex: 1,
      }}
    >
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {currentItems.length > 0 ? (
          <>
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row" }}>
                {currentItems.slice(0, 7).map((item, index) => (
                  <TouchableOpacity
                    style={{
                      height: 123,
                      width: 100,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginHorizontal: layout.spacing_x1,
                    }}
                    onPress={() => {
                      onSelect(item);
                    }}
                  >
                    <Box
                      style={{
                        width: 100,
                        height: 100,
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
                        {currentPage * itemsPerPage + index + 1}
                      </BrandText>
                    </PrimaryBox>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ flexDirection: "row" }}>
                {currentItems.slice(7).map((item, index) => (
                  <TouchableOpacity
                    style={{
                      height: 123,
                      width: 100,
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginHorizontal: layout.spacing_x1,
                    }}
                    onPress={() => {
                      onSelect(item);
                    }}
                  >
                    <Box
                      style={{
                        width: 100,
                        height: 100,
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
                        {currentPage * itemsPerPage + index + 1 + 7}
                      </BrandText>
                    </PrimaryBox>
                  </TouchableOpacity>
                ))}
              </View>
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
      {assets.length > 0 && (
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flex: 1,
          }}
        >
          <AssetsPagination
            currentPage={currentPage}
            maxPage={totalPage}
            onChangePage={(page) => setCurrentPage(page)}
          />
          <SpacerColumn size={2} />
        </View>
      )}
    </View>
  );
};
