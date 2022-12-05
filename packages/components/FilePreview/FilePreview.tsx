import mime from "mime";
import React from "react";

import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
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

  if (
    IMAGE_MIME_TYPES.map((type) => mime.getExtension(type)).includes(extension)
  ) {
    return <ImagePreview fileURL={httpFileURL} />;
  } else if (
    AUDIO_MIME_TYPES.map((type) => mime.getExtension(type)).includes(extension)
  ) {
    return <AudioPreview fileURL={httpFileURL} />;
  } else if (
    VIDEO_MIME_TYPES.map((type) => mime.getExtension(type)).includes(extension)
  ) {
    return <VideoPreview fileURL={httpFileURL} />;
  }
  return null;
};
