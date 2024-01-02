import React, { useMemo } from "react";
import { View } from "react-native";
import { z } from "zod";

import { ImagesViews } from "../../../components/FilePreview/ImagesViews";
import { VideoView } from "../../../components/FilePreview/VideoView";
import { ZodRemoteFileData } from "../../../utils/types/files";

interface Props {
  files: z.infer<typeof ZodRemoteFileData>[];
  maxWidth?: number;
  waveFormMaxWidth?: number;
}

export const FileRenderer = ({ files, maxWidth, waveFormMaxWidth }: Props) => {
  const imageFiles = useMemo(
    () =>
      files
        ?.filter(
          (file) => file.fileType === "image" || file.fileType === "base64",
        )
        .map((file) => ({
          ...file,
        })),
    [files],
  );
  const videoFiles = useMemo(
    () => files?.filter((file) => file.fileType === "video"),
    [files],
  );

  return (
    <View style={{ width: maxWidth || "100%" }}>
      {!!imageFiles?.length && <ImagesViews files={imageFiles || []} />}

      {videoFiles?.map((file, index) => (
        <VideoView key={index} file={file} authorId="" />
      ))}
    </View>
  );
};
