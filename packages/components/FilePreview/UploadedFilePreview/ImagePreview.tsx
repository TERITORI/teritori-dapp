import React from "react";
import { Image, View } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { layout } from "../../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
import { DeleteButton } from "./DeleteButton";

interface ImagePreviewProps {
  files: LocalFileData[] | RemoteFileData[];
  onDelete: (url: string) => void;
  isEditable?: boolean;
}

const getDimension = (index: number, fileLength: number) => {
  if (index === 0) {
    return {
      height: fileLength > 3 ? 200 : 400,
      width: fileLength === 1 ? "100%" : "50%",
    };
  } else {
    return {
      height: fileLength === 2 ? 400 : 200,
      width: "50%",
      ...(fileLength === 3 && index === 2
        ? { position: "absolute", right: 0, bottom: 0 }
        : {}),
    };
  }
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  files,
  onDelete,
  isEditable = false,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        height: 400,
      }}
    >
      {files.map((file, index) => (
        <View
          key={file.fileName}
          style={{
            padding: layout.padding_x1,
            ...getDimension(index, files.length),
          }}
        >
          {isEditable && (
            <DeleteButton
              onPress={() => onDelete(file.url)}
              style={{
                top: 0,
                right: 0,
              }}
            />
          )}
          <Image
            source={{ uri: ipfsURLToHTTPURL(file.url) }}
            resizeMode="cover"
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4,
            }}
          />
        </View>
      ))}
    </View>
  );
};
