import React from "react";
import { View, ViewStyle } from "react-native";

import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/feed";
import { AudioPreview } from "./AudioPreview";
import { ImagePreview } from "./ImagePreview";
import { VideoPreview } from "./VideoPreview";

interface FilePreviewContainerProps {
  style?: ViewStyle;
  files?: LocalFileData[];
  gifs?: string[];
  onDelete: (index?: number | string) => void;
  onDeleteGIF: (index: number) => void;
  onUploadThumbnail: (file: LocalFileData) => void;
}

export const convertGIFToLocalFileType = (gif: string): LocalFileData => ({
  file: new File([], ""),
  fileName: "gif",
  mimeType: "images/gif",
  size: 120,
  url: gif,
  fileType: "image",
});

export const FilePreviewContainer: React.FC<FilePreviewContainerProps> = ({
  files,
  gifs,
  onDelete,
  onDeleteGIF,
  onUploadThumbnail,
  style,
}) => {
  if (!files?.length && !gifs?.length) {
    return null;
  }

  return (
    <View
      style={[
        {
          width: "100%",
          marginBottom: layout.padding_x2,
          paddingHorizontal: layout.padding_x2,
        },
      ]}
    >
      {files?.[0]?.fileType === "audio" && (
        <AudioPreview
          file={files[0]}
          onDelete={() => onDelete()}
          onUploadThumbnail={onUploadThumbnail}
        />
      )}
      {(files?.[0]?.fileType === "image" || gifs?.length) && (
        <ImagePreview
          files={[
            ...(gifs?.map(convertGIFToLocalFileType) || []),
            ...(files || []),
          ]}
          onDelete={(url) => onDelete(url)}
          isEditable
        />
      )}
      {files?.[0]?.fileType === "video" && (
        <VideoPreview file={files[0]} onDelete={onDelete} isEditable />
      )}
    </View>
  );
};
