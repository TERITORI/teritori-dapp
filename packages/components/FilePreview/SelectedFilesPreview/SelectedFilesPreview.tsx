import React from "react";
import { View } from "react-native";

import { fileItemPreviewWidth, ItemView } from "./ItemView";
import { neutral33, neutral55 } from "../../../utils/style/colors";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";

import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { GridList } from "@/components/layout/GridList";
import { layout } from "@/utils/style/layout";

export const SelectedFilesPreview: React.FC<{
  files: LocalFileData[];
  onPressItem: (file: LocalFileData, itemIndex: number) => void;
  onPressDeleteItem: (itemIndex: number) => void;
}> = ({ files, onPressItem, onPressDeleteItem }) => {
  return (
    <View>
      <View
        style={{
          justifyContent: "flex-end",
        }}
      >
        {files.length ? (
          <GridList<LocalFileData>
            data={files}
            keyExtractor={(item) => item.url}
            renderItem={(info, elemWidth) => (
              <View>
                <DeleteButton
                  onPress={() => onPressDeleteItem(info.index)}
                  style={{ top: 12, right: 0 }}
                />
                <ItemView
                  uri={URL.createObjectURL(info.item.file)}
                  label={info.index + 1}
                  onPress={() => {
                    onPressItem(info.item, info.index);
                  }}
                  style={{ width: elemWidth }}
                />
              </View>
            )}
            minElemWidth={fileItemPreviewWidth}
            gap={layout.spacing_x2}
            noFixedHeight
          />
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
    </View>
  );
};
