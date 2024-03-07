import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import React from "react";

import cameraSVG from "@/assets/icons/camera-white.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { LocalFileData } from "@/utils/types/files";

type Props = {
  files?: LocalFileData[];
  onSelectFile: (data: LocalFileData[]) => void;
};

export const SelectPicture = ({ files, onSelectFile }: Props) => {
  const onCameraPress = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        selectionLimit: 1,
      });

      if (
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].mimeType &&
        IMAGE_MIME_TYPES.includes(result?.assets?.[0]?.mimeType?.toLowerCase())
      ) {
        const choseFile = result.assets[0];

        if (files?.find((file) => file.fileName === choseFile.fileName)) return;

        const imagePath = choseFile?.uri;
        const imageMime = `${choseFile.mimeType}`;
        if (imagePath) {
          const fileName = `${choseFile.fileName}`;

          onSelectFile([
            ...(files || []),
            {
              file: new File([], ""),
              fileName,
              fileType: "image",
              mimeType: imageMime,
              size: choseFile.fileSize || 0,
              url: choseFile?.uri || "",
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
      onPress={onCameraPress}
      disabled={Array.isArray(files) && files?.length > 0}
    >
      <SVG
        source={cameraSVG}
        height={24}
        width={24}
        style={{
          opacity: Array.isArray(files) && files?.length > 0 ? 0.7 : 1,
        }}
      />
    </CustomPressable>
  );
};
