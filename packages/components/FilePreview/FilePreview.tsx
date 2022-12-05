import React from "react";

import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  AUDIO_EXTENSIONS,
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
} from "../../utils/mime";
import { AudioPreview } from "./AudioPreview";
import { FileViewerProps } from "./FilePreview.type";
import { ImagePreview } from "./ImagePreview";
import { VideoPreview } from "./VideoPreview";

export const FilePreview: React.FC<FileViewerProps> = ({ fileURL }) => {
  const extension = fileURL.substring(
    fileURL.lastIndexOf(".") + 1,
    fileURL.length
  );

  const httpFileURL = ipfsURLToHTTPURL(fileURL);

  if (IMAGE_EXTENSIONS.includes(extension)) {
    return <ImagePreview fileURL={httpFileURL} />;
  } else if (AUDIO_EXTENSIONS.includes(extension)) {
    return <AudioPreview fileURL={httpFileURL} />;
  } else if (VIDEO_EXTENSIONS.includes(extension)) {
    return <VideoPreview fileURL={httpFileURL} />;
  }
  return null;
};
