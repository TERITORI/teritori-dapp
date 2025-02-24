import { FC } from "react";
import { View } from "react-native";

import { itemSize, ItemView } from "./ItemView";
import { BrandText } from "../../BrandText";
import { PrimaryBox } from "../../boxes/PrimaryBox";

import { DeleteButton } from "@/components/FilePreview/DeleteButton";
import { GridList } from "@/components/layout/GridList";
import { neutral33, neutral55 } from "@/utils/style/colors";
import { fontSemibold20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const SelectedFilesPreview: FC<{
  files: LocalFileData[];
  onPressItem: (file: LocalFileData, itemIndex: number) => void;
  onPressDeleteItem: (itemIndex: number) => void;
}> = ({ files, onPressItem, onPressDeleteItem }) => {
  return (
    <View
      style={{
        justifyContent: "flex-end",
        height: "100%",
      }}
    >
      {files.length ? (
        <GridList<LocalFileData>
          data={files}
          keyExtractor={(item) => item.url}
          renderItem={({ item, index }, elemWidth) => (
            <View
              style={{
                height: itemSize + 6, // +6 to show DeleteButton
                justifyContent: "flex-end",
              }}
            >
              <DeleteButton
                onPress={() => onPressDeleteItem(index)}
                style={{ top: 0, right: 0 }}
              />
              <ItemView
                uri={URL.createObjectURL(item.file)}
                label={`#${index + 1}`}
                subLabel={item.file.name}
                onPress={() => {
                  onPressItem(item, index);
                }}
                style={{ width: elemWidth }}
              />
            </View>
          )}
          minElemWidth={itemSize}
          gap={layout.spacing_x2_5}
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
  );
};
