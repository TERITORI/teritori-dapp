import React, { useMemo } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { EditableAudioPreview } from "./EditableAudioPreview";
import { ImagesViews } from "./ImagesViews";
import { VideoView } from "./VideoView";
import { GIF_MIME_TYPE } from "../../utils/mime";
import { convertGIFToLocalFileType } from "../../utils/social-feed";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/files";

interface FilePreviewContainerProps {
  files?: LocalFileData[];
  gifs?: string[];
  onDelete: (file: LocalFileData | RemoteFileData) => void;
  onDeleteGIF: (url: string) => void;
  onAudioUpdate: (updatedFile: LocalFileData) => void;
  showSmallPreview?: boolean;
}

export const FilesPreviewsContainer: React.FC<FilePreviewContainerProps> = ({
  files,
  gifs,
  onDelete,
  onDeleteGIF,
  onAudioUpdate,
  showSmallPreview = false,
}) => {
  const audioFiles = useMemo(
    () => files?.filter((file) => file.fileType === "audio"),
    [files],
  );
  const imageFiles = useMemo(
    () => files?.filter((file) => file.fileType === "image"),
    [files],
  );
  const videoFiles = useMemo(
    () => files?.filter((file) => file.fileType === "video"),
    [files],
  );
  const gifsFiles = useMemo(() => {
    const fileName = "GIF-" + uuidv4();
    return gifs?.map((gif) => convertGIFToLocalFileType(gif, fileName));
  }, [gifs]);

  if (!files?.length && !gifs?.length) {
    return null;
  }
  return (
    <View
      style={[
        {
          width: "100%",
          marginBottom: layout.spacing_x2,
          paddingHorizontal: layout.spacing_x2,
        },
      ]}
    >
      {gifsFiles?.length || imageFiles?.length ? (
        <ImagesViews
          files={[...(gifsFiles || []), ...(imageFiles || [])]}
          onDelete={(file: LocalFileData | RemoteFileData) => {
            if (file.mimeType === GIF_MIME_TYPE) onDeleteGIF(file.url);
            else onDelete(file);
          }}
          isEditable
          showSmallPreview={showSmallPreview}
        />
      ) : null}

      {videoFiles?.map((file, index) => (
        <VideoView
          key={index}
          file={file}
          onDelete={onDelete}
          isEditable
          showSmallPreview={showSmallPreview}
        />
      ))}

      {audioFiles?.map((file, index) => (
        <EditableAudioPreview
          key={index}
          file={file}
          onDelete={(file: LocalFileData) => onDelete(file)}
          onUploadThumbnail={onAudioUpdate}
        />
      ))}
    </View>
  );
};
