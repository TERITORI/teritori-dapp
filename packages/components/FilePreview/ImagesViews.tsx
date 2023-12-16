import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { DeleteButton } from "./DeleteButton";
import { ImagesFullViewModal } from "./ImagesFullViewModal";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { errorColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";
import { BrandText } from "../BrandText";
import { OptimizedImage } from "../OptimizedImage";

interface ImagePreviewProps {
  files: LocalFileData[] | RemoteFileData[];
  onDelete?: (file: LocalFileData | RemoteFileData) => void;
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

export const ImagesViews: React.FC<ImagePreviewProps> = ({
  files,
  onDelete,
  isEditable = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullView, setFullView] = useState(false);
  const [formattedFiles, setFormattedFiles] = useState(files);

  useEffect(() => {
    const fetchContent = async () => {
      const formattedData = await Promise.all(
        files.map(async (file) => {
          if (file.fileType === "base64") {
            const response = await fetch(ipfsURLToHTTPURL(file.url));
            const content = await response.text();
            return {
              ...file,
              base64Image: content,
            };
          }
          return file;
        }),
      );
      setFormattedFiles(formattedData);
    };

    fetchContent();
  }, [files]);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        height: 400,
      }}
    >
      <ImagesFullViewModal
        files={formattedFiles.map((file) =>
          file.fileType === "image"
            ? ipfsURLToHTTPURL(file.url)
            : file.base64Image || "",
        )}
        activeIndex={activeIndex}
        isVisible={isFullView}
        onClose={() => setFullView(false)}
      />

      {formattedFiles.map((file, index) => {
        if (!file?.url)
          return (
            <BrandText style={[fontSemibold13, { color: errorColor }]}>
              Image not found
            </BrandText>
          );
        return (
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(index);
              setFullView(true);
            }}
            key={file.url}
            //@ts-expect-error
            style={{
              padding: layout.spacing_x1,
              ...getDimension(index, files.length),
            }}
          >
            {isEditable && onDelete && (
              <DeleteButton
                onPress={() => {
                  onDelete(file);
                }}
                style={{
                  top: 0,
                  right: 0,
                }}
              />
            )}
            <OptimizedImage
              sourceURI={
                file.fileType === "image" ? file.url : file.base64Image || ""
              }
              height={400}
              width={800}
              resizeMode="contain"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 4,
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
