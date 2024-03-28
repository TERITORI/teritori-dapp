import * as DocumentPicker from "expo-document-picker";
import React, { ReactNode } from "react";

import micSVG from "@/assets/icons/mic-white.svg";
import videoSVG from "@/assets/icons/video.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { getAudioData } from "@/utils/audio";
import { AUDIO_MIME_TYPES, VIDEO_MIME_TYPES } from "@/utils/mime";
import { LocalFileData } from "@/utils/types/files";
import { getVideoData } from "@/utils/video";

type FileType = "audio" | "video";

type Props = {
  files?: LocalFileData[];
  onSelectFile: (data: LocalFileData[]) => void;
  type: FileType;
  title?: ReactNode;
};

export const SelectAudioVideo = ({
  onSelectFile,
  type,
  files,
  title,
}: Props) => {
  const onChooseFilePress = async (fileType: FileType) => {
    try {
      const acceptableMimeTypes =
        fileType === "audio" ? AUDIO_MIME_TYPES : VIDEO_MIME_TYPES;
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: acceptableMimeTypes,
      });

      if (
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].mimeType &&
        acceptableMimeTypes.includes(result?.assets?.[0]?.mimeType)
      ) {
        const choseFile = result.assets[0];

        if (files?.find((file) => file.fileName === choseFile.name)) return;
        const filePath = choseFile?.uri;
        const mimeType = `${choseFile.mimeType}`;
        if (filePath) {
          const fileName = `${choseFile.name}`;
          const file = new File([], "");

          const metaData: Pick<
            LocalFileData,
            "videoMetadata" | "audioMetadata"
          > = {
            videoMetadata: undefined,
            audioMetadata: undefined,
          };
          if (fileType === "video") {
            metaData.videoMetadata = await getVideoData(file);
          }
          if (fileType === "audio") {
            metaData.audioMetadata = await getAudioData(file);
          }

          onSelectFile([
            {
              file,
              fileName,
              fileType,
              mimeType,
              size: choseFile?.size || 0,
              url: choseFile?.uri || "",
              ...metaData,
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CustomPressable
      onPress={() => onChooseFilePress(type)}
      disabled={Array.isArray(files) && files?.length > 0}
    >
      {title || (
        <SVG
          source={type === "audio" ? micSVG : videoSVG}
          height={24}
          width={24}
          style={{
            opacity: Array.isArray(files) && files?.length > 0 ? 0.7 : 1,
          }}
        />
      )}
    </CustomPressable>
  );
};
