import React from "react";
import { Image } from "react-native";

import { useImageResizer } from "../../hooks/useImageResizer";
import { FileViewerProps } from "./FilePreview.type";

export const ImagePreview: React.FC<FileViewerProps> = ({
  fileURL,
  maxWidth,
}) => {
  const { width, height } = useImageResizer({
    image: { uri: fileURL },
    maxSize: { width: maxWidth },
  });

  return (
    <Image
      source={{ uri: fileURL }}
      style={{
        height,
        width,
      }}
    />
  );
};
