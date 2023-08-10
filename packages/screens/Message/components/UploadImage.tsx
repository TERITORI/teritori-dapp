import * as ImagePicker from "expo-image-picker";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Platform } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { FileUploader } from "../../../components/fileUploader";
import {
  convertFileToBase64,
  imagePickerAssetToLocalFile,
} from "../../../utils/file";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import {
  neutral11,
  neutral15,
  neutral22,
  neutralA3,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { LocalFileData } from "../../../utils/types/feed";
import { MessageFileData } from "../../../utils/types/message";

interface UploadImageProps {
  onClose?: () => void;
  setFile: (file: MessageFileData) => void;
}

const LIST = [
  {
    title: " Attach file",
    mimeTypes: [...AUDIO_MIME_TYPES],
  },
  {
    title: "Attach image/video",
    mimeTypes: [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES],
  },
];

export const UploadImage = ({ onClose, setFile }: UploadImageProps) => {
  const [hasFile, setHasFile] = useState(false);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const checkUploadCancel = () => {
    if (Platform.OS === "web") {
      window.onfocus = () => {
        setTimeout(() => {
          if (!hasFile) {
            onClose?.();
          }
        }, 1000);
      };
    }
  };

  const handleUpload = async (file: LocalFileData) => {
    setHasFile(true);
    if (file) {
      const base64: string = await convertFileToBase64(file.file);

      setFile({
        ...omit(file, "file"),
        url: base64,
        type: "image",
      });
      onClose?.();
    }
  };

  const permissions = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("permissions", permission);
  };

  useEffect(() => {
    permissions();
  }, []);

  return (
    <View
      style={{
        position: "absolute",
        top: -115,
        left: 10,
        backgroundColor: neutral15,
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        zIndex: 111,
      }}
    >
      {LIST.map((item, index) => (
        <TouchableOpacity
          style={{
            width: 120,
            height: 40,
            justifyContent: "center",
            borderBottomColor: neutral22,
            borderBottomWidth: index === LIST.length - 1 ? 0 : 1,
          }}
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              // aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setFile(imagePickerAssetToLocalFile(result.assets[0]));
            }
          }}
        >
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {item.title}
          </BrandText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
