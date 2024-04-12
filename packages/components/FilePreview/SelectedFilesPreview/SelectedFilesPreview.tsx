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

import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { layout } from "@/utils/style/layout";

const RowSplitValue = 7;
const itemsPerPage = 14; // Number of items to display per page

export const SelectedFilesPreview: React.FC<{
  files: LocalFileData[];
  onPressItem: (file: LocalFileData, itemIndex: number) => void;
  onPressDeleteItem: (itemIndex: number) => void;
}> = ({ files, onPressItem, onPressDeleteItem }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    if (files) {
      setTotalPage(Math.ceil(files.length / itemsPerPage));
    }
  }, [files]);

  const indexOfLastItem = currentPage * itemsPerPage + itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = files.slice(indexOfFirstItem, indexOfLastItem);

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
                <View key={index}>
                  <DeleteButton
                    onPress={() => onPressDeleteItem(index)}
                    style={{ top: 12, right: 0 }}
                  />
                  <ItemView
                    uri={URL.createObjectURL(item.file)}
                    label={currentPage * itemsPerPage + index + 1}
                    onPress={() => {
                      onPressItem(item, index);
                    }}
                  />
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row" }}>
              {currentItems.slice(RowSplitValue).map((item, index) => (
                <View key={index}>
                  <DeleteButton
                    onPress={() => onPressDeleteItem(index)}
                    style={{ top: 12, right: 0 }}
                  />
                  <ItemView
                    uri={URL.createObjectURL(item.file)}
                    label={
                      currentPage * itemsPerPage + index + 1 + RowSplitValue
                    }
                    onPress={() => {
                      onPressItem(item, index);
                    }}
                  />
                </View>
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
              Selected files preview
            </BrandText>
          </PrimaryBox>
        )}
      </View>

      {files.length > 0 && (
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flex: 1,
            marginTop: layout.spacing_x2,
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
