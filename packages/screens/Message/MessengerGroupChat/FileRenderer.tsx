import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

import { AudioView } from "../../../components/FilePreview/AudioView";
import { ImageView } from "../../../components/FilePreview/ImageView";
import { VideoView } from "../../../components/FilePreview/VideoView";
import { RemoteFileData } from "../../../utils/types/feed";
interface Props {
  files: RemoteFileData[];
}
export const THUMBNAIL_WIDTH = 140;

export const FileRenderer = ({ files }: Props) => {
  console.log(files);

  const { width } = useWindowDimensions();
  const audioFiles = useMemo(
    () => files?.filter((file) => file.fileType === "audio"),
    [files]
  );
  const imageFiles = useMemo(
    () =>
      files
        ?.filter(
          (file) => file.fileType === "image" || file.fileType === "base64"
        )
        .map((file) => ({
          ...file,
          // url: file.url.split(",")[1],
        })),
    [files]
  );
  const videoFiles = useMemo(
    () => files?.filter((file) => file.fileType === "video"),
    [files]
  );

  return (
    <View
      style={{
        width: width - 700,
      }}
    >
      {!!imageFiles?.length && <ImageView files={imageFiles || []} />}

      {videoFiles?.map((file, index) => (
        <VideoView key={index} file={file} />
      ))}

      {audioFiles?.map((file, index) => (
        <AudioView key={index} file={file} />
      ))}
    </View>
  );
};
