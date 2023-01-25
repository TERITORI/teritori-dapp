import React from "react";

import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from "../../utils/mime";
import { FileViewerProps } from "./FilePreview.type";
import { ImagePreview } from "./ImagePreview";
import { VideoPreview } from "./VideoPreview";

export const FilePreview: React.FC<FileViewerProps> = ({
  fileURL,
  maxWidth,
}) => {
  const extension = fileURL.substring(
    fileURL.lastIndexOf(".") + 1,
    fileURL.length
  );

  const httpFileURL = ipfsURLToHTTPURL(fileURL);

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return <ImagePreview fileURL={httpFileURL} maxWidth={maxWidth} />;
  } else if (VIDEO_EXTENSIONS.includes(extension)) {
    return <VideoPreview fileURL={httpFileURL} />;
  }
  return null;
};
