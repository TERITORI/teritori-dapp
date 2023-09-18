import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

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
  // const [hasFile, setHasFile] = useState(false);
  // const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleUpload = async () => {
    try {
      console.log("trying");
      // const permission = await requestPermission();
      // console.log("media per", permission);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      console.log("result", result);

      if (!result.canceled) {
        setFile(imagePickerAssetToLocalFile(result.assets[0]));
      }
    } catch (err) {
      console.log("perm er", err);
    }
  };

  const permissions = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("permissions", permission);
  };

  useEffect(() => {
    permissions();
  }, []);

  const LIST = [
    {
      title: "Attach image/video",
      mimeTypes: [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES],
      onPress: async () => {
        handleUpload();
      },
    },
    {
      title: " Attach file",
      mimeTypes: [...AUDIO_MIME_TYPES],
      onPress: async () => {
        await DocumentPicker.getDocumentAsync();
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
