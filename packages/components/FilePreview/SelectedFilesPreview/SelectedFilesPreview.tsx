import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { ItemView } from "./ItemView";
import { neutral33, neutral55 } from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";
import { SpacerColumn } from "../../spacer";
import { AssetsPagination } from "../AssetsPagination/AssetsPagination";

const RowSplitValue = 7;
const itemsPerPage = 14; // Number of items to display per page

export const SelectedFilesPreview: React.FC<{
  assets: LocalFileData[];
  onSelect: (item: LocalFileData) => void;
}> = ({ assets, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

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
        }}
      >
        {currentItems.length > 0 ? (
          <>
            <View style={{ flexDirection: "row" }}>
              {currentItems.slice(0, RowSplitValue).map((item, index) => (
                <ItemView
                  uri={URL.createObjectURL(item.file)}
                  label={currentPage * itemsPerPage + index + 1}
                  onPress={() => {
                    onSelect(item);
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row" }}>
              {currentItems.slice(RowSplitValue).map((item, index) => (
                <ItemView
                  uri={URL.createObjectURL(item.file)}
                  label={currentPage * itemsPerPage + index + 1 + RowSplitValue}
                  onPress={() => {
                    onSelect(item);
                  }}
                />
              ))}
            </View>
          </>
        ) : (
          <PrimaryBox
            style={{
              height: 267,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderColor: neutral33,
            }}
          >
            <BrandText style={[fontSemibold20, { color: neutral55 }]}>
              Select assets to preview
            </BrandText>
          </PrimaryBox>
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
