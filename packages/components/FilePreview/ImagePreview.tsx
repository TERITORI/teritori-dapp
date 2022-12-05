import React from "react";
import { Image } from "react-native";

import { FileViewerProps } from "./FilePreview.type";

export const ImagePreview: React.FC<FileViewerProps> = ({ fileURL }) => (
  <Image
    source={{ uri: fileURL }}
    style={{
      height: 300,
      width: "100%",
    }}
  />
);
