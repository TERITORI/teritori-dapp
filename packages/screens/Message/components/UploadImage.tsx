import { omit } from "lodash";
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { FileUploader } from "../../../components/fileUploader";
import { convertFileToBase64 } from "../../../utils/file";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";

interface UploadImageProps {
  onClose: () => void;
  setFile: (file: RemoteFileData) => void;
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

  const checkUploadCancel = () => {
    try {
      window.onfocus = () => {
        setTimeout(() => {
          if (!hasFile) {
            onClose();
          }
        }, 1000);
      };
    } catch (err) {}
  };

  const handleUpload = async (file: LocalFileData) => {
    setHasFile(true);
    if (file) {
      const base64 = await convertFileToBase64(file.file);

      setFile({
        ...omit(file, "file"),
        url: base64,
      });
      onClose();
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        top: -55,
        left: 10,
        backgroundColor: "rgba(41, 41, 41, 0.8)",
        padding: 6,
        borderRadius: 6,
        borderWidth: 1,
        zIndex: 111,
      }}
    >
      {LIST.map((item) => (
        <FileUploader
          key={item.title}
          onUpload={async (files) => {
            handleUpload(files?.[0]);
          }}
          mimeTypes={item.mimeTypes}
        >
          {({ onPress }) => (
            <TouchableOpacity
              style={{
                width: 120,
                height: 25,
              }}
              onPress={() => {
                onPress();
                setTimeout(() => {
                  checkUploadCancel();
                }, 500);
              }}
            >
              <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
                {item.title}
              </BrandText>
            </TouchableOpacity>
          )}
        </FileUploader>
      ))}
    </View>
  );
};
