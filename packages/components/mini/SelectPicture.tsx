import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import React from "react";
import { View } from "react-native";

import { BrandText } from "../BrandText";

import cameraSVG from "@/assets/icons/camera-white.svg";
import Img from "@/assets/icons/img.svg";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral33 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

type Props = {
  files?: LocalFileData[];
  onSelectFile: (data: LocalFileData[]) => void;
  squareSelector?: boolean;
  squareSelectorOptions?: {
    placeholder?: string;
    height?: number;
  };
  hideRemove?: boolean;
};

export const SelectPicture = ({
  files,
  onSelectFile,
  squareSelector = false,
  squareSelectorOptions = {
    placeholder: "Select Image",
    height: 198,
  },
  hideRemove = false,
}: Props) => {
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
      {squareSelector ? (
        <View
          style={[
            {
              borderRadius: layout.spacing_x1,
              borderWidth: 1,
              borderColor: neutral33,
              height: squareSelectorOptions.height,
              alignItems: "center",
              justifyContent: "flex-end",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#2B2B33",
              borderRadius: 32,
              paddingLeft: layout.spacing_x1,
              paddingRight: layout.spacing_x1_5,
              height: 32,
              marginBottom: layout.spacing_x2,
              gap: layout.spacing_x1,
            }}
          >
            <SVG source={Img} width={16} height={16} />
            {squareSelectorOptions.placeholder && (
              <BrandText style={fontSemibold14}>
                {squareSelectorOptions.placeholder}
              </BrandText>
            )}
          </View>
        </View>
      ) : (
        <SVG
          source={cameraSVG}
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
