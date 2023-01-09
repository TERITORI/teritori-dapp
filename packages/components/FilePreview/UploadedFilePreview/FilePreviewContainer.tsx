import React from "react";
import { View, ViewStyle } from "react-native";

import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { FilePreview } from "./FilePreview";
import { ImagePreview } from "./ImagePreview";

interface FilePreviewContainerProps {
  style?: ViewStyle;
  files?: File[];
  gifs?: string[];
  onDelete: (index: number) => void;
  onDeleteGIF: (index: number) => void;
}

export const ItemPreview = ({
  file,
  onDelete,
}: {
  file: File;
  onDelete: () => void;
}) => {
  if (IMAGE_MIME_TYPES.includes(file.type)) {
    return <ImagePreview url={file.path} key={file.name} onDelete={onDelete} />;
  } else {
    return <FilePreview file={file} key={file.name} onDelete={onDelete} />;
  }
};

export const FilePreviewContainer: React.FC<FilePreviewContainerProps> = ({
  files,
  gifs,
  onDelete,
  onDeleteGIF,
  style,
}) => {
  if (!files?.length && !gifs?.length) {
    return null;
  }

  return (
    <View
      style={[
        {
          flexDirection: "row",
        },
        style,
      ]}
    >
      {(files || []).map((file, index) => (
        <ItemPreview file={file} key={index} onDelete={() => onDelete(index)} />
      ))}
      {(gifs || []).map((gif, index) => (
        <ImagePreview
          url={gif}
          key={index}
          onDelete={() => onDeleteGIF(index)}
        />
      ))}
    </View>
  );
};
