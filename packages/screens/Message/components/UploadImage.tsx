import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { imagePickerAssetToLocalFile } from "../../../utils/file";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import { neutral15, neutral22, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { MessageFileData } from "../../../utils/types/message";

interface UploadImageProps {
  onClose?: () => void;
  setFile: (file: MessageFileData) => void;
}

export const UploadImage = ({ onClose, setFile }: UploadImageProps) => {
  const handleUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled) {
        const file = await imagePickerAssetToLocalFile(result.assets[0]);
        setFile(file);
      }
    } catch (err) {
      console.log("perm er", err);
    }
    onClose?.();
  };

  const LIST = [
    {
      title: "Attach image/video",
      mimeTypes: [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES],
      onPress: async () => {
        await handleUpload();
      },
    },
    {
      title: " Attach file",
      mimeTypes: [...AUDIO_MIME_TYPES],
      onPress: async () => {
        try {
          const res = await DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
          });

          if (!res.canceled) {
            if (res?.assets || res?.output) {
              const file = res.assets?.[0] || res.output?.[0];
              if (Platform.OS !== "web") {
                const base64Data = await FileSystem.readAsStringAsync(
                  file.uri,
                  {
                    encoding: FileSystem.EncodingType.Base64,
                  }
                );
                console.log("base64Data", base64Data);
              }

              const formattedFile = await imagePickerAssetToLocalFile(file);
              setFile(formattedFile);
            }
          }
        } catch (err) {
          console.log("document upload err", err);
        }
        onClose?.();
      },
    },
  ];

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
          onPress={item.onPress}
        >
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            {item.title}
          </BrandText>
        </TouchableOpacity>
      ))}
    </View>
  );
};
