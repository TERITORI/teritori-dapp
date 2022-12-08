import { Video, ResizeMode } from "expo-av";
import React from "react";

import { FileViewerProps } from "./FilePreview.type";

export const VideoPreview: React.FC<FileViewerProps> = ({ fileURL }) => {
  return (
    <Video
      source={{
        uri: fileURL,
      }}
      useNativeControls
      resizeMode={ResizeMode.CONTAIN}
    />
  );
};
